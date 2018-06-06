IOT Back-end REST API
=====================
https://github.com/heig-vd-iot2018/back-end

**Version:** 0.0.1

### Security
---
**Bearer**  

|apiKey|*API Key*|
|---|---|
|Name|Authorization|
|In|header|

### /auth
---
##### ***POST***
**Description:** Sign a user in using username and password credentials.

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| credentials | body | Credentials object. | Yes | [Credentials](#credentials) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Authentication successfull. | string |
| 400 | Bad request | [ErrorResponse](#errorresponse) |
| 401 | Unauthorized username or password | [ErrorResponse](#errorresponse) |

null

### /sensors
---
##### ***GET***
**Description:** Returns list of all sensors

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [ [Sensor](#sensor) ] |
| default | Error | [ErrorResponse](#errorresponse) |

### /sensors/{id}
---
##### ***GET***
**Description:** Get a sensor

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The id of the sensors to get | Yes | integer |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [Sensor](#sensor) |
| default | Error | [ErrorResponse](#errorresponse) |

##### ***PATCH***
**Description:** To modifiy a sensors

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The id of the sensors to get | Yes | integer |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK |
| default | Error | [ErrorResponse](#errorresponse) |

### /nodes
---
##### ***GET***
**Description:** Returns list of all nodes

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [Node](#node) |
| default | Error | [ErrorResponse](#errorresponse) |

##### ***POST***
**Description:** Add a node to the DB

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| node | body | The node to be put in db | Yes | [Node](#node) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Node created | [Node](#node) |
| default | Error | [ErrorResponse](#errorresponse) |

### /nodes/{id}
---
##### ***GET***
**Description:** Returns a node

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The id of the node to get | Yes | integer |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [Node](#node) |
| default | Error | [ErrorResponse](#errorresponse) |

### /sensors/data
---
##### ***POST***
**Description:** Allow sensors to post their data

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | body | The id of the node to set | Yes | [SensorData](#sensordata) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success |
| default | Error | [ErrorResponse](#errorresponse) |

### /swagger
---
### Models
---

### Credentials  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| username | string |  | Yes |
| password | password |  | Yes |

### Node  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| createdDate | string |  | Yes |
| lastUpdated | string |  | Yes |
| active | boolean |  | Yes |
| localisation | string |  | Yes |
| sensors | [ integer ] |  | Yes |

### Sensor  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| createdDate | string |  | Yes |
| lastUpdated | string |  | Yes |
| active | boolean |  | Yes |
| refreshInterval | integer |  | Yes |
| encoding | string |  | Yes |
| values | [ string ] |  | Yes |
| documentation | string |  | Yes |

### SensorData  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| payload | string |  | Yes |

### ErrorResponse  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |