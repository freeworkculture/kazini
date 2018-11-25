/* Payment system handler
*/

<!DOCTYPE html>
<html>
<head>
        Access-Control-Allow-Origin
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script src="//api.bitrix24.com/api/v1/"></script>
</head>
<body>
</body>
</html>
<script type="text/javascript">

    BX24.init(function(){
    console.log('Init done!', BX24.isAdmin());
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
} from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
import { DECIMALS, NULL_ADDRESS } from '../constants';
import { getContractAddressesForNetwork, getContractWrappersConfig } from '../contracts';
import { PrintUtils } from '../print_utils';
import { providerEngine } from '../provider_engine';
import { getRandomFutureDateInSeconds } from '../utils';



var id = prompt("Enter ID");
BX24.callMethod('crm.invoice.get', {"ID": id}, addProduct);
function addProduct(result)
{
    if(result.error())
        console.error(result.error());
    else
    {
        var fields = clone(result.data());
        var n = fields['PRODUCT_ROWS'].length;
        var productUpdated = false;

        // update the created-on date fields["DATE_BILL"] = "20.07.2013";
        // update the "Invoice notes (appears on invoice)" field fields["USER_DESCRIPTION"] = "Invoice notes (updated).";

        // If the invoice includes an item ID=703, update the item fields.
        // Otherwise, create and add a new product item.
        // We safely assume the price includes taxes because 
        // we can tell if it's not by the catalog's tax-included flag.
        for (var i in fields['PRODUCT_ROWS'])
        {
            if (fields['PRODUCT_ROWS'][i]["PRODUCT_ID"] == 703)
            {
                var rowId = fields['PRODUCT_ROWS'][i]["ID"]
                fields['PRODUCT_ROWS'][i] = {
                    "ID": rowId, "PRODUCT_ID": 703, "QUANTITY": 4, "PRICE": 779.60
                };
                productUpdated = true;
                break;
            }
        }

        if (!productUpdated && n > 0)
        {
            fields['PRODUCT_ROWS'][n] = 
            {
                "ID": 0, "PRODUCT_ID": 703, "QUANTITY": 5, "PRICE": 779.60
            };
        }

        BX24.callMethod('crm.invoice.update', {"ID": id, "FIELDS": fields},
            function(result)
            {
                if(result.error())
                    console.error(result.error());
                else
                {
                    console.info("Invoice ID=" + result.data() + "has been updated.");
                }
            }
        );
    }
}

function clone(src)
{
    var dst;
    if (src instanceof Object)
    {
        dst = {};
        for (var i in src)
        {
            if (src[i] instanceof Object)
                dst[i] = clone(src[i]);
            else
                dst[i] = src[i];
        }
    }
    else dst = src;
    return dst;
}