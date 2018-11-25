; (function () {
	window.kaziniApp = function () {
		this.params = {
			weekDeltaBack: -3,
			weekDeltaFwd: 2
		};

		this.access = 'user';
		this.bCanEdit = false;
		this.options = {};

		this.div = $('<div class="layout"></div>');
		this.parts = {
			weekSelector: $('<div class="week-selector"></div>').appendTo(this.div),
			weekMenu: $('<div class="week-menu"></div>').appendTo(this.div),
			addForm: null,
			addFormHint: null,
			settingsButton: null
		};

		this.dateStart = null;
		this.dateFinish = null;

		this.hints_data = {};

		window.kaziniApp.loadLang($.proxy(function () {
			$($.proxy(this.ready, this));
		}, this));

		this.init();
	};

	window.kaziniApp.loadLang = function (fn) {
		var supportedLangs = {
			'en': 'lang/en.js',
			'de': 'lang/de.js',
			'ru': 'lang/ru.js',
			'ua': 'lang/ua.js'
		};

		var currentLang = BX24.getLang();

		if (typeof supportedLangs[currentLang] == 'undefined')
			currentLang = 'en';

		$.getScript(supportedLangs[currentLang], fn);
	};

	window.kaziniApp.prototype.init = function () {
		this.options = BX24.appOption.get('options');
		this.options.payment = this.options.payment == "1";

		if (BX24.isAdmin()) {
			this.access = 'admin';
			this.initData();
		}
		else {
			BX24.callMethod('user.access', { ACCESS: this.options.access }, $.proxy(function (res) {
				this.access = res.data() ? 'editor' : 'user';
				this.initData();
			}, this)
			);
		}
	};

	window.kaziniApp.prototype.ready = function () {
		$("body").append(this.div);
		BX24.fitWindow();
	};

	window.kaziniApp.prototype.initData = function () {
		this.bCanEdit = (this.access == 'admin' || this.access == 'editor');

		var weekStart = this.nullifyDate(new Date());
		weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay() + parseInt(this.options.week_start) || 0 - 1);

		var weekFinish = new Date(weekStart.valueOf());
		weekFinish.setUTCDate(weekStart.getUTCDate() + 7);

		this.loadData(weekStart, weekFinish);
	};

	//HERE WE LOAD A KEYSTORE!!!!! 
	window.kaziniApp.prototype.loadData = function (dateStart, dateFinish) {
		this.dateStart = dateStart;
		this.dateFinish = dateFinish;

		BX24.callMethod('entity.item.get', {
			ENTITY: 'menu', /// THE KEY STORE DIRECTORY NOT MENU BUT KEYSTORE!!!!
			SORT: { DATE_ACTIVE_FROM: 'ASC', ID: 'ASC' },
			FILTER: {
				'>=DATE_ACTIVE_FROM': dateStart,
				'<DATE_ACTIVE_FROM': dateFinish
			}
		}, $.proxy(this.buildData, this));
	};

	window.kaziniApp.prototype.buildData = function (result) {
		var d = this.params.weekDeltaBack * 7 * 86400 * 1000,
			ds = new Date(this.dateStart.valueOf() + d),
			df = new Date(this.dateFinish.valueOf() + d - 1),
			today = this.nullifyDate(new Date());

		/*
			callbacks and generators
		*/

		// week selector click
		var cb = $.proxy(this.loadData, this),
			gcb = function (tsStart, tsFinish) {
				return function () {
					cb(new Date(tsStart), new Date(tsFinish));
				}
			};

		if (this.bCanEdit) {
			// add new dish callback
			var cbe = $.proxy(this.addForm, this),
				gcbe = function (tsStart, list) {
					return function () {
						cbe(new Date(tsStart), list);
					}
				};
			// delete dish from menu callback
			var cbd = $.proxy(this.del, this),
				gcbd = function (id) {
					return function () {
						cbd(id);
					}
				};
			// share day menu via livefeed
			var cbs = $.proxy(this.share, this),
				gcbs = function (item) {
					return function () {
						cbs(item);
					}
				};
		}

		if (this.access == 'admin') {
			this.buildAdmin();
		}

		if (!!this.parts.addForm) {
			this.parts.addForm.hide().appendTo($("body"));
		}

		this.parts.weekSelector.empty();
		this.parts.weekMenu.empty();

		for (var i = this.params.weekDeltaBack; i <= this.params.weekDeltaFwd; i++) {
			$('<div class="week-select' + (i == 0 ? ' week-selected' : '') + '">' + this.formatDate(ds, df) + '</div>').on('click', gcb(ds.valueOf(), df.valueOf() + 1)).appendTo(this.parts.weekSelector);

			ds.setUTCDate(ds.getUTCDate() + 7);
			df.setUTCDate(df.getUTCDate() + 7);
		}

		if (result.error()) {
			throw result.error();
		}
		else {
			var dishes = [], day = 0;

			for (var d = 0; d < result.data().length; d++) {
				var dish = result.data()[d];

				// IE8 doesn't accept ISO8601 date, so we use hack from https://github.com/csnover/js-iso8601
				dish.DATE_ACTIVE_FROM = new Date(Date.parse(dish.DATE_ACTIVE_FROM));
				day = dish.DATE_ACTIVE_FROM.getUTCDay();

				if (!dishes[day])
					dishes[day] = [dish];
				else
					dishes[day].push(dish);
			}

			ds = new Date(this.dateStart.valueOf());
			for (var i = 0; i < 7; i++) {
				day = ds.getUTCDay();

				var item = $('<div class="menu-day"><div class="menu-date">' + this.getDay(ds) + ', ' + this.formatDate(ds) + '</div></div>');

				var list = $('<ul class="menu-list"></ul>').appendTo(item);

				if (!!dishes[day]) {
					for (var d = 0; d < dishes[day].length; d++) {
						var dish = $('<li class="menu-list-item"></li>')
							.append(
								$('<span class="menu-list-name"></span>')
									.text(dishes[day][d].NAME)
							);

						if (this.options.payment) {
							$('<span class="menu-list-price"></span>')
								.text(this.formatPrice(dishes[day][d].PROPERTY_VALUES.price))
								.appendTo(dish);
						}

						if (this.bCanEdit) {
							$('<span class="menu-list-delete"></span>')
								.on('click', gcbd(dishes[day][d].ID))
								.appendTo(dish);
						}

						dish.appendTo(list);
					}
				}

				if (this.bCanEdit) {
					$('<div class="menu-add"></div>')
						.text(window.menuMessage.MENU_DISH_ADD)
						.on('click', gcbe(ds.valueOf(), list))
						.appendTo(item);

					$('<div class="menu-share"></div>')
						.text(window.menuMessage.MENU_DISH_SHARE)
						.on('click', gcbs(item))
						.appendTo(item);
				}

				if (ds.valueOf() == today.valueOf())
					item.addClass('menu-day-today');

				item.appendTo(this.parts.weekMenu);
				ds.setUTCDate(ds.getUTCDate() + 1);
			}
		}
		function testETH() {
			console.log('starting...');
			// const ethers = require('ethers');
	
			// You can use any standard network name
			//  - "homestead"
			//  - "rinkeby"
			//  - "ropsten"
			//  - "kovan"
	
			let provider = ethers.getDefaultProvider('ropsten');
	
	
			var blockData;
	
			var blockNum = provider.getBlockNumber().then((blockNumber) => {
	
				blockNum = blockNumber;
				console.log("Current block number: " + blockNumber);
			});
	
			provider.getBlock(blockNum).then((block) => {
	
				blockData = block;
				console.log("Current block data: " + block);
			});
	
	
			import {
				assetDataUtils,
				BigNumber,
				ContractWrappers,
				generatePseudoRandomSalt,
				Order,
				orderHashUtils,
				signatureUtils,
				SignedOrder,
			} from 'ZeroEx.js';
	
	
			import { Web3Wrapper } from '@0x/web3-wrapper';
	
			import { NETWORK_CONFIGS, TX_DEFAULTS } from '../lib/0x-starter-project/src/configs';
			import { DECIMALS, NULL_ADDRESS } from '../lib/0x-starter-project/src/constants';
			import { getContractAddressesForNetwork, getContractWrappersConfig } from '../lib/0x-starter-project/src/contracts';
			import { PrintUtils } from '../lib/0x-starter-project/src/print_utils';
			import { providerEngine } from '../lib/0x-starter-project/src/provider_engine';
			import ServerWalletProvider from '../lib/server-wallet-provider/src/index';
			import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js';
			import { getRandomFutureDateInSeconds } from '../lib/0x-starter-project/src/utils';
	
			/**
			 * In this scenario a third party, called the sender, submits the operation on behalf of the taker.
			 * This allows a sender to pay the gas on for the taker. It can be combined with a custom sender
			 * contract with additional business logic (e.g checking a whitelist). Or the sender
			 * can choose how and when the transaction should be submitted, if at all.
			 * The maker creates and signs the order. The signed order and fillOrder parameters for the
			 * execute transaction function call are signed by the taker.
			 */
			export async function scenarioAsync(): Promise<void> {
				PrintUtils.printScenario('Execute Transaction fillOrder');
				// Initialize the ContractWrappers, this provides helper functions around calling
				// 0x contracts as well as ERC20/ERC721 token contracts on the blockchain
				const contractWrappers = new ContractWrappers(providerEngine, getContractWrappersConfig(NETWORK_CONFIGS.networkId));
				// Initialize the Web3Wrapper, this provides helper functions around fetching
				// account information, balances, general contract logs
				const web3Wrapper = new ZeroEx.Web3Wrapper(providerEngine);
				const [maker, taker, sender] = await web3Wrapper.getAvailableAddressesAsync();
				const feeRecipientAddress = sender;
				const contractAddresses = getContractAddressesForNetwork(NETWORK_CONFIGS.networkId);
				const zrxTokenAddress = contractAddresses.zrxToken;
				const etherTokenAddress = contractAddresses.etherToken;
				const printUtils = new PrintUtils(
					web3Wrapper,
					contractWrappers,
					{ maker, taker, sender },
					{ WETH: etherTokenAddress, ZRX: zrxTokenAddress },
				);
				printUtils.printAccounts();
	
				// the amount the maker is selling of maker asset
				const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
				// the amount the maker wants of taker asset
				const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
				// the amount of fees the maker pays in ZRX
				const makerFee = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.01), DECIMALS);
				// the amount of fees the taker pays in ZRX
				const takerFee = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.01), DECIMALS);
				// 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
				const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
				const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
				let txHash;
	
				// Approve the ERC20 Proxy to move ZRX for maker
				const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
					zrxTokenAddress,
					maker,
				);
				await printUtils.awaitTransactionMinedSpinnerAsync('Maker ZRX Approval', makerZRXApprovalTxHash);
	
				// Approve the ERC20 Proxy to move ZRX for taker
				const takerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
					zrxTokenAddress,
					taker,
				);
				await printUtils.awaitTransactionMinedSpinnerAsync('Taker ZRX Approval', takerZRXApprovalTxHash);
	
				// Approve the ERC20 Proxy to move WETH for taker
				const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
					etherTokenAddress,
					taker,
				);
				await printUtils.awaitTransactionMinedSpinnerAsync('Taker WETH Approval', takerWETHApprovalTxHash);
	
				// Convert ETH into WETH for taker by depositing ETH into the WETH contract
				const takerWETHDepositTxHash = await contractWrappers.etherToken.depositAsync(
					etherTokenAddress,
					takerAssetAmount,
					taker,
				);
				await printUtils.awaitTransactionMinedSpinnerAsync('Taker WETH Deposit', takerWETHDepositTxHash);
	
				PrintUtils.printData('Setup', [
					['Maker ZRX Approval', makerZRXApprovalTxHash],
					['Taker ZRX Approval', takerZRXApprovalTxHash],
					['Taker WETH Approval', takerWETHApprovalTxHash],
					['Taker WETH Deposit', takerWETHDepositTxHash],
				]);
	
				// Set up the Order and fill it
				const randomExpiration = getRandomFutureDateInSeconds();
	
				// Create the order
				const orderWithoutExchangeAddress = {
					makerAddress: maker,
					takerAddress: NULL_ADDRESS,
					senderAddress: NULL_ADDRESS,
					feeRecipientAddress,
					expirationTimeSeconds: randomExpiration,
					salt: generatePseudoRandomSalt(),
					makerAssetAmount,
					takerAssetAmount,
					makerAssetData,
					takerAssetData,
					makerFee,
					takerFee,
				};
	
				const exchangeAddress = contractAddresses.exchange;
				const order: Order = {
					...orderWithoutExchangeAddress,
					exchangeAddress,
				};
				printUtils.printOrder(order);
	
				// Print out the Balances and Allowances
				await printUtils.fetchAndPrintContractAllowancesAsync();
				await printUtils.fetchAndPrintContractBalancesAsync();
	
				// Generate the order hash and sign it
				const orderHashHex = orderHashUtils.getOrderHashHex(order);
				const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);
	
				const signedOrder: SignedOrder = {
					...order,
					signature,
				};
	
				// The transaction encoder provides helpers in encoding 0x Exchange transactions to allow
				// a third party to submit the transaction. This operates in the context of the signer (taker)
				// rather then the context of the submitter (sender)
				const transactionEncoder = await contractWrappers.exchange.transactionEncoderAsync();
				// This is an ABI encoded function call that the taker wishes to perform
				// in this scenario it is a fillOrder
				const fillData = transactionEncoder.fillOrderTx(signedOrder, takerAssetAmount);
				// Generate a random salt to mitigate replay attacks
				const takerTransactionSalt = generatePseudoRandomSalt();
				// The taker signs the operation data (fillOrder) with the salt
				const executeTransactionHex = transactionEncoder.getTransactionHex(fillData, takerTransactionSalt, taker);
				const takerSignatureHex = await signatureUtils.ecSignHashAsync(providerEngine, executeTransactionHex, taker);
				// The sender submits this operation via executeTransaction passing in the signature from the taker
				txHash = await contractWrappers.exchange.executeTransactionAsync(
					takerTransactionSalt,
					taker,
					fillData,
					takerSignatureHex,
					sender,
					{
						gasLimit: TX_DEFAULTS.gas,
					},
				);
				const txReceipt = await printUtils.awaitTransactionMinedSpinnerAsync('executeTransaction', txHash);
				printUtils.printTransaction('Execute Transaction fillOrder', txReceipt, [['orderHash', orderHashHex]]);
	
				// Print the Balances
				await printUtils.fetchAndPrintContractBalancesAsync();
	
				// Stop the Provider Engine
				providerEngine.stop();
			}
	
			void (async () => {
				try {
					if (!module.parent) {
						await scenarioAsync();
					}
				} catch (e) {
					console.log(e);
					providerEngine.stop();
					process.exit(1);
				}
			});

		BX24.fitWindow();
	};



	window.kaziniApp.prototype.buildAdmin = function () {
		if (this.access == 'admin') {
			if (!this.parts.settingsButton) {
				this.parts.settingsButton = $('<span class="menu-settings"></span>')
					.on('click', $.proxy(this.settingsForm, this))
					.appendTo(this.div);
			}
		}
	};

	window.menuApp.prototype.settingsForm = function () {
		if (this.access == 'admin') {
			this.div.detach();
			window.menuAppInstaller.makeHtml();
			window.menuAppInstaller.init($.proxy(function () {
				$('#install').replaceWith(this.div);
				this.init();
				this.ready();
			}, this));
		}
	};

	window.menuApp.prototype.hideForm = function () {
		this.parts.addForm.hide(400, 'slide');
	};

	window.menuApp.prototype.add = function () {
		if (this.bCanEdit) {
			if (!!document.forms.add_form.NAME._value
				&& document.forms.add_form.NAME.value != document.forms.add_form.NAME._value) {
				document.forms.add_form.ID.value = '';
			}

			document.forms.add_form.NAME._value = null;

			var batch = [],
				dish = {
					ENTITY: 'dish',
					NAME: document.forms.add_form.NAME.value,
					PROPERTY_VALUES: {}
				};

			if (document.forms.add_form.ID.value > 0) {
				dish.ID = document.forms.add_form.ID.value;
			}

			dish["FILTER"] = { ">=test": "test" };

			batch = [
				["entity.item." + (!!dish.ID ? "update" : "add"), dish],
				['entity.item.add', {
					ENTITY: 'menu',
					NAME: dish.NAME,
					DATE_ACTIVE_FROM: document.forms.add_form.TS.value,
					PROPERTY_VALUES: {
						dish: !!dish.ID ? dish.ID : '$result[0]'
					}
				}]
			];

			if (this.options.payment) {
				batch[0][1].PROPERTY_VALUES.price = batch[1][1].PROPERTY_VALUES.price = document.forms.add_form.PRICE.value;
			}

			BX24.callBatch(batch, $.proxy(function (res) {
				// if(!res.error())
				// {
				this.parts.addForm.hide();
				this.hints_data = {};

				if (!!document.forms.add_form) {
					document.forms.add_form.NAME.value = '';
					document.forms.add_form.ID.value = '';
					if (!!document.forms.add_form.PRICE)
						document.forms.add_form.PRICE.value = '';
				}

				this.loadData(this.dateStart, this.dateFinish);
				// }
				// else
				// {
				// 	alert(res.error());
				// }
			}, this), true);

		}
	};

	window.menuApp.prototype.del = function (id) {
		if (this.bCanEdit) {
			BX24.callMethod('entity.item.delete', {
				ENTITY: 'menu',
				ID: id
			}, $.proxy(function (res) {
				if (res.error())
					throw res.error();
				else
					this.loadData(this.dateStart, this.dateFinish);
			}, this));
		}
	};

	window.menuApp.prototype.share = function (item) {
		var list = $('.menu-list-item', item),
			message = '',
			bPrice = this.options.payment;

		if (list.length > 0) {
			list.each(function () {
				var t = $('.menu-list-name', $(this)).text();
				if (t != '') {
					message += '[*]'
						+ t
						+ (bPrice ? (' - ' + $('.menu-list-price', $(this)).text()) : '')
				}
			});

			if (message.length > 0) {
				var params = {
					POST_TITLE: window.menuMessage.MENU_DISH_SHARE_TITLE
						.replace('#DATE#', $('.menu-date', item).text()),
					POST_MESSAGE: '[LIST]' + message + '[/LIST]'
				};

				BX24.callMethod('log.blogpost.add', params, function (r) {
					if (!r.error()) {
						$('.menu-share', item)
							.text(window.menuMessage.MENU_DISH_SHARED)
							.addClass('menu-share-finished')
							.off('click')
					}
				});

				return;
			}
		}

		$('.menu-share', item).effect("bounce", "slow");
	};

	window.menuApp.prototype.loadHint = function () {
		if (this.bCanEdit) {
			if (document.forms.add_form) {
				if (!!this.hintTimeout) {
					clearTimeout(this.hintTimeout);
				}

				this.hintTimeout = setTimeout($.proxy(this.getHint, this), 500);
			}
		}
	};

	window.menuApp.prototype.getHint = function () {
		if (this.bCanEdit) {
			if (document.forms.add_form) {
				var start = document.forms.add_form.NAME.value,
					cb = $.proxy(function (data) {
						this.hints_data[start] = data;
						this.updateHint(data);
					}, this);
				if (!this.hints_data[start]) {
					BX24.callMethod('entity.item.get', {
						ENTITY: 'dish',
						SORT: {
							DATE_CREATE: 'DESC',
							NAME: 'ASC'
						},
						FILTER: {
							'NAME': start + '%'
						}
					}, $.proxy(function (res) {
						if (res.error()) {
							throw res.error();
						}
						else {
							cb(res.data());
						}
					}, this));
				}
				else {
					cb(this.hints_data[start]);
				}
			}
		}
	};

	window.menuApp.prototype.setFormData = function (ID, NAME, PRICE) {
		this.closeHint();
		if (document.forms.add_form) {
			document.forms.add_form.ID.value = ID;
			document.forms.add_form.NAME.value = NAME;
			document.forms.add_form.NAME._value = NAME;

			if (!!this.options.payment)
				document.forms.add_form.PRICE.value = PRICE;
		}
	};

	window.menuApp.prototype.updateHint = function (data) {
		var cbh = $.proxy(this.setFormData, this),
			gcbh = function (ID, NAME, PRICE) {
				return function () {
					cbh(ID, NAME, PRICE);
				}
			};

		if (!this.addFormHint) {
			this.addFormHint = $('<div class="input-name-hint"></div>').hide();
		}

		this.addFormHint.empty();
		if (data.length > 0) {
			for (var i = 0; i < Math.min(data.length, 10); i++) {
				$('<div class="input-name-hint-item"></div>')
					.text(data[i].NAME)
					.appendTo(this.addFormHint)
					.on('click', gcbh(data[i].ID, data[i].NAME, data[i].PROPERTY_VALUES.price))
			}
		}

		this.addFormHint.css('top', $('li.menu-list-item-edit').height());

		this.addFormHint.slideDown(100, BX24.fitWindow);
		$('li.menu-list-item-edit').append(this.addFormHint);
	};

	window.menuApp.prototype.closeHint = function () {
		if (!!this.addFormHint) {
			setTimeout($.proxy(function () {
				this.addFormHint.slideUp(100, BX24.fitWindow);
			}, this), 50);
		}
	};

	window.kaziniApp.prototype.nullifyDate = function (date) {
		date.setUTCHours(0);
		date.setUTCMinutes(0);
		date.setUTCSeconds(0);
		date.setUTCMilliseconds(0);

		return date;
	};

	window.kaziniApp.prototype.formatDate = function (ds, df) {
		return this.pad(ds.getUTCDate()) + '.' + this.pad(ds.getUTCMonth() + 1) + '.' + (!!df
			? (' - ' + this.pad(df.getUTCDate()) + '.' + this.pad(df.getUTCMonth() + 1) + '.' + df.getUTCFullYear())
			: ds.getUTCFullYear()
		);
	};

	window.kaziniApp.prototype.formatPrice = function (price) {
		var str_price = (parseFloat(price) || 0).toFixed(2) + '';

		if (str_price.length > 6) {
			for (var i = str_price.length - 6; i > 0; i -= 3) {
				str_price = str_price.substring(0, i) + ' ' + str_price.substring(i, str_price.length);
			}
		}

		return str_price + ' ' + this.options.currency
	};

	window.kaziniApp.prototype.getDay = function (d) {
		return window.menuMessage['WD' + d.getUTCDay()];
	};

	window.kaziniApp.prototype.pad = function (str) {
		str += '';
		if (str.length < 2)
			str = '0' + str;
		return str;
	};


	}) ();