BX24.callMethod(
    "sale.paysystem.handler.add",
    {
        'NAME' : 'KaziniPays handler', 							// Name of handler
        'SORT' : 100, 											// Sorting
        'CODE' : 'kazinihandlercode', 							// Unique code of handler in the system
        'SETTINGS' : { 											// Handler settings
            'CURRENCY' : {'USD'}, 								// List of currencies, supported by the handler
            'FORM_DATA' : { 									// Form settings
                'ACTION_URI' : 'https://payment_service_url', 	// URL, where the form will be sent
                'METHOD' : 'POST', 								// Method for sending form
                'PARAMS' : { 									// Chart with links between form fields and handler parameters: array of "array" type (code_field => code_handler_parameter)
                    'serviceid' : 'REST_SERVICE_ID',
                    'invoiceNumber' : 'PAYMENT_ID',
                    'Sum' : 'PAYMENT_SHOULD_PAY',
                    'customer' : 'PAYMENT_BUYER_ID',
                }
            },
            'CODES' : {											// LIst of handler parameters
                "REST_SERVICE_ID" : {							// Parameter code
                    "NAME" : 'Payment system number',					// Parameter name
                    "DESCRIPTION" : 'Payment system number',			// Parameter description
                    'SORT' : 100,								// Sortintg
                },
                "REST_SERVICE_KEY" : {
                    "NAME" : 'Secret key',
                    "DESCRIPTION" : 'Secret key',
                    'SORT' : 300,
                },
                "PAYMENT_ID" : {
                    "NAME" : 'Payment number',
                    'SORT' : 400,
                    'GROUP' : 'PAYMENT',
                    'DEFAULT' : {
                        'PROVIDER_KEY' : 'PAYMENT',
                        'PROVIDER_VALUE' : 'ACCOUNT_NUMBER'
                    }
                },
                "PAYMENT_SHOULD_PAY" : {
                    "NAME" : 'Payment amount',
                    'SORT' : 600,
                    'GROUP' : 'PAYMENT',
                    'DEFAULT' : {
                        'PROVIDER_KEY' : 'PAYMENT',
                        'PROVIDER_VALUE' : 'SUM'
                    }
                },
                "PS_CHANGE_STATUS_PAY" : {
                    "NAME" : 'Payment status automatic change',
                    'SORT' : 700,
                    "INPUT" : {
                        'TYPE' : 'Y/N'
                    },
                },
                "PAYMENT_BUYER_ID" : {
                    "NAME" : 'Buyer code',
                    'SORT' : 1000,
                    'GROUP' : 'PAYMENT',						// type of string value, checkbox and etc.
                    'DEFAULT' : {								// By default value
                        'PROVIDER_KEY' : 'ORDER',				// Value type (see. available list below)
                        'PROVIDER_VALUE' : 'USER_ID'			// Value (see. available list below)
                    }
                }
            }
        }
    },
    function(result)
    {
        if(result.error())
            console.error(result.error());
        else
            console.info("Handler is added with ID" + result.data());
    }
);