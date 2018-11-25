
/* MPSR Message Packet custom interface
*/
export interface MPSRMessage {
    particularsOfGrantors: {
        GRANTORS_NAME: string,
        GRANTORS_NATIONALITY: string,
        GRANTORS_TAX_ID: string,
        GRANTORS_ID_NUMBER: string,
        GRANTORS_POSTAL_ADDRESS: string,
        GRANTORS_POSTAL_CODE: string,
        GRANTORS_EMAIL: string,
        GRANTORS_TELEPHONE: number
    },
    particularsOfCreditors: {
        CREDITORS_NAME: string,
        CREDITORS_NATIONALITY: string,
        CREDITORS_TAX_ID: string,
        CREDITORS_ID_NUMBER: string,
        CREDITORS_POSTAL_ADDRESS: string,
        CREDITORS_POSTAL_CODE: string,
        CREDITORS_EMAIL: string,
        CREDITORS_TELEPHONE: number
        categoryOfSecuredCredit: string,
        typeOfNonSecuredCreditor: string
    },
    detailsOfCollateral: {
        collateralType: {
            universal: false,
            tangible: false,
            fungible: false,
            temporal: false,
            generic: false
        },
        description: string
    },
    particularsOfSecuredLoan: {
        maximumAmountSecured: {symbol: symbol, value: number},
        effectivePeriodInMonths: number,
        consensual: false,
        relatesToPriorSecurity: false
    }
}