# Transaction Watch Dog

## How to run

1. Download the repository.
2. Run `npm install` in the repository root.

> Please, make sure you have a local instance of MySQL running on localhost before continuing. Knowledge of the user and password of this instance will be necessary as well. Follow [this](https://www.javatpoint.com/how-to-install-mysql) tutorial if you need any help with installing MySQL.

3. Create a new database (schema) in the local MySQL instance called "watchdog".

4. Create a .env file in the repository root and add the following variables:

- INFURA_API_KEY - use the key I have provided over email or another API key provided by Infura;
- DB_USER - the MySQL user;
- DB_PASSWORD - the MySQL user's password;

5. Save the .env file and run `npm start`

## How to use

Once ran, the application starts getting notifications on every new header appended to the Ethereum blockchain. Until a configuration is set by the user, it will not write anything to the database.

Each configuration consist of rules, which are connected to the properties of a transaction on the Ethereum blockchain. Configurations are not connected - if a transaction passes one configuration and does not pass another, it will still be written to the database. If a transaction passes multiple configurations, the first one passed will be set to be its connected configuration.

To set a configuration, use the manual on how to use the API below.

Rules for numeric fields allow comparison by the operators lt(<), lte(<=), gt(>), gte(>=), eq(=) and range. More on how to use them in the API documentation below.

## How to use the API

The API consists of 5 endpoints. Each of them will be described below.

### `GET http://localhost:5000/api/v1/configurations`

This endpoint responds with all available configurations at the time of the request.

### `GET http://localhost:5000/api/v1/configurations/{id}`

- **id** - id of a configuration in the database

This endpoint responds with the configuration with **id** equal to the one provided in the **id** parameter.

### `POST http://localhost:5000/api/v1/configurations`

This endpoint is used for the creation of new configurations. It responds with the newly created configuration. It is necessary to provide a JSON object, consisting of the rules in the new configuration, as a body to the request. An example body would be:

`{ "configurationName": "New Configuration", "configurationBlockHash": null, "configurationBlockNumber": null, "configurationFrom": null, "configurationGas": null, "configurationGasPrice": null, "configurationTransactionFee": "gt 0.0003", "configurationHash": null, "configurationNonce": "lte 1000", "configurationTo": null, "configurationTransactionIndex": null, "configurationType": null, "configurationValue": "range 1,2", "configurationDelay": 0 }`

This configuration will make the application check for transactions where the transactionFee was more than 0.0003 ETH, the nonce was less than or equal to 1000 and the value sent was more than or equal to 1 ETH and less than or equal to 2 ETH.

> In the above example I have provided all available properties of a configuration in the request body. Note that properties set to null or 0 can be omitted and the request will still be successful - the properties will default to null or 0 (or in the case of configurationName - to "configuration") in the database.

> Request will be successful if atleast one property, different from configurationName, has been provided.

Properties are structured in the following way:

1. String properties

- exact comparison of the provided string to the string in the respective transaction field;
- configurationName - the name of the current configuration;
- configurationBlockHash - the hash of the block that the transaction is in;
- configurationFrom - the sender of the transaction;
- configurationHash - the hash of the transaction;
- configurationTo - the receiver of the transaction;
- configurationType - the type of transaction; one of "legacy", "accessList" or "EIP-1559" needs to be provided.

3. Numeric properties

- comparison is done by using the operators lt(<), lte(<=), gt(>), gte(>=), eq(=) or range;
- format of property is either `<eq|lt|lte|gt|gte> [number]` or `<range> [number],[number]`
- example eq|lt|lte|gt|gte: `gte 3` - transaction property greater than or equal to 3;
- example range: `range 3,5` - transaction property greater than or equal to 3 and less than or equal to 5;
- configurationBlockNumber - the block number of the transaction;
- configurationGas - the gas units used for the transaction;
- configurationGasPrice - the gas price at the time of transaction;
- configurationTransactionFee - gas units multiplied by gasPrice in ETH;
- configurationNonce - the number of transactions made by the sender prior to this one;
- configurationTransactionIndex - the transaction's index position in the block;
- configurationValue - value transferred in ETH.

4. configurationDelay

- sets the amount of blocks to be skipped before starting to apply the configuration;
- value can be only a positive integer.

### `PATCH http://localhost:5000/api/v1/configurations{id}`

- **id** - id of a configuration in the database

This endpoint updates the configuration with **id** equal to the one provided in the **id** parameter with the properties provided in the **body** of the request. For more information about the body, see the POST request above. The response consists of the updated configuration.

### `DELETE http://localhost:5000/api/v1/configurations{id}`

- **id** - id of a configuration in the database

This endpoint deletes the configuration with **id** equal to the one provided in the **id** parameter and responds with successful message if successful.
