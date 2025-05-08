# innochallenge-disponent

## important links

### API URL
[General](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1)

#### Trucks
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/trucks](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/trucks)
```json
{
"driverId": "D01",
"firstName": "Noah",
"lastName": "Müller",
"mnemonic": "NOMÜ",
"craneLicenseOwner": true,
"forkliftLicenseOwner": true,
"longTruckLicenseOwner": true,
"eurotrailerLicenseOwner": true,
"adrLicenseOwner": true,
"currentLocation": "1000001",
"homeBase": "1000001"
}
```

#### Trailers
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/trailers](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/trailers)
```json
{
"trailerId": "TR1",
"dispositionGroup": "AUTOBAM2",
"licensePlate": "BA-E 9006",
"trailerType": "MTR",
"emptyWeight": 6340,
"maximumWeight": 36000,
"allowedPayloadWeight": 29660,
"currentLocation": "1000001",
"homeBase": "1000001"
}
```

#### Drivers (anonymized)
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/truck-drivers](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/truck-drivers)
```json
{
"driverId": "D01",
"firstName": "Noah",
"lastName": "Müller",
"mnemonic": "NOMÜ",
"craneLicenseOwner": true,
"forkliftLicenseOwner": true,
"longTruckLicenseOwner": true,
"eurotrailerLicenseOwner": true,
"adrLicenseOwner": true,
"currentLocation": "1000001",
"homeBase": "1000001"
},
```


#### Locations
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/locations](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/locations)
```json
{
"locationId": "89",
"isHomeBase": false,
"isExchangeSpot": false,
"isDestination": true
}
```

#### Location-Addresses
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-addresses](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-addresses)
```json
{
"locationId": "89",
"name": "Müller GmbH",
"address": "Eichenstraße 33",
"areaCode": "71063",
"city": "Sindelfingen",
"country": "DEU"
}
```

#### Location-Coordinates
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-coordinates](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-coordinates)
```json
{
"locationId": "89",
"latitude": 48.7131518,
"longitude": 9.0000948
}
```

#### Location Opening Times (probably not required)
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-opening-times](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/location-opening-times)
```json
{
"openingTimeId": {
"locationId": "89",
"operationalFunction": "DESTINATION",
"dayOfWeek": "MONDAY"
},
"openingTime": "05:30:00",
"closingTime": "21:30:00"
}
```


#### Delivered Goods -> not relevant for usecase but maybe for presentation / FE
[https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/delivery-requests](https://optimaloptimizer.thankfulbeach-22a876ac.westus2.azurecontainerapps.io/api/v1/delivery-requests)
