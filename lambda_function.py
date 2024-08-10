import logging
import json
import urllib3

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    directive = event.get('directive')
    
    if directive['header']['namespace'] == 'Alexa.Discovery':
        return handle_discovery(event, directive)
    elif directive['header']['namespace'] == 'Alexa.PowerController':
        return handle_power_control(event)
    elif directive['header']['namespace'] == 'Alexa':
        if directive['header']['name'] == 'ReportState':
            return handle_report_state(event, directive)

def handle_discovery(event, directive):
    http = urllib3.PoolManager()
    token = directive['payload']['scope']['token']
    
    resp = http.request('GET', "https://kumkum.aitech.work/api/alexa/devices",
                        headers={
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer {}".format(token)
                        })
    
    devices = json.loads(resp.data.decode('utf-8'))
    
    endpoints = []
    for device in devices:
        capabilities = [{
            'type': 'AlexaInterface',
            'interface': 'Alexa.PowerController',
            'version': '3',
            'properties': {
                'supported': [{'name': 'powerState'}],
                'proactivelyReported': False,
                'retrievable': True
            }
        }]

        if 'setPercentage' in device['actions']:
            capabilities.append({
                'type': 'AlexaInterface',
                'interface': 'Alexa.PercentageController',
                'version': '3',
                'properties': {
                    'supported': [{'name': 'percentage'}],
                    'proactivelyReported': False,
                    'retrievable': True
                }
            })
        if 'setColor' in device['actions']:
            capabilities.append({
                'type': 'AlexaInterface',
                'interface': 'Alexa.ColorController',
                'version': '3',
                'properties': {
                    'supported': [{'name': 'color'}],
                    'proactivelyReported': False,
                    'retrievable': True
                }
            })
        if 'setColorTemperature' in device['actions']:
            capabilities.append({
                'type': 'AlexaInterface',
                'interface': 'Alexa.ColorTemperatureController',
                'version': '3',
                'properties': {
                    'supported': [{'name': 'colorTemperature'}],
                    'proactivelyReported': False,
                    'retrievable': True
                }
            })

        category = "OTHER"
        if 'light' in device['friendlyName'].lower():
            category = "LIGHT"
        elif 'heater' in device['friendlyName'].lower():
            category = "WATER_HEATER"
        elif 'switch' in device['friendlyName'].lower():
            category = "SWITCH"

        endpoint = {
            'endpointId': device['applianceId'],
            'manufacturerName': device['manufacturerName'],
            'modelName': device['modelName'],
            'friendlyName': device['friendlyName'],
            'description': device['friendlyDescription'],
            'isReachable': device['isReachable'],
            'displayCategories': [category],
            'capabilities': capabilities
        }

        endpoints.append(endpoint)

    return {
        'event': {
            'header': {
                'namespace': 'Alexa.Discovery',
                'name': 'Discover.Response',
                'payloadVersion': '3',
                'messageId': 'uniqueMessageId'
            },
            'payload': {
                'endpoints': endpoints
            }
        }
    }

def handle_power_control(event):
    directive = event.get('directive')
    logger.info("power control")
    endpoint_id = directive['endpoint']['endpointId']
    token = directive['endpoint']['scope']['token']
    correlation_token = directive['header']['correlationToken']
    power_state = directive['header']['name']
    
    state = "ON" if power_state == "TurnOn" else "OFF"
    
    http = urllib3.PoolManager()
    resp = http.request('POST', "https://kumkum.aitech.work/api/alexa/device/control",
                        headers={
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer {}".format(token)
                        },
                        body=json.dumps({
                            'applianceId': endpoint_id,
                            'state': state
                        }))
    
    if resp.status != 200:
        logger.error(f"Failed to update device state: Status code {resp.status}")
        raise Exception("Device state update failed")
    
    return {
        'context': {
            'properties': [{
                'namespace': 'Alexa.PowerController',
                'name': 'powerState',
                'value': state,
                'timeOfSample': "2024-06-26T16:20:50.52Z",
                'uncertaintyInMilliseconds': 500
            }]
        },
        'event': {
            'header': {
                'namespace': 'Alexa',
                'name': 'Response',
                'payloadVersion': '3',
                'messageId': 'uniqueMessageId',
                'correlationToken': correlation_token
            },
            'endpoint': {
                'endpointId': endpoint_id
            },
            'payload': {}
        }
    }

def handle_report_state(event, directive):
    endpoint_id = directive['endpoint']['endpointId']
    token = directive['endpoint']['scope']['token']
    correlation_token = directive['header']['correlationToken']
    
    http = urllib3.PoolManager()
    resp = http.request('GET', "https://kumkum.aitech.work/api/alexa/device/state",
                        headers={
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer {}".format(token)
                        },
                        fields={'applianceId': endpoint_id})
    
    if resp.status != 200:
        logger.error(f"Failed to fetch device state: Status code {resp.status}")
        raise Exception("Failed to fetch device state")

    device_state = json.loads(resp.data.decode('utf-8'))
    
    return {
        'context': {
            'properties': [{
                'namespace': 'Alexa.PowerController',
                'name': 'powerState',
                'value': device_state['state'],
                'timeOfSample': "2024-06-26T16:20:50.52Z",
                'uncertaintyInMilliseconds': 500
            }]
        },
        'event': {
            'header': {
                'namespace': 'Alexa',
                'name': 'StateReport',
                'payloadVersion': '3',
                'messageId': 'uniqueMessageId',
                'correlationToken': correlation_token
            },
            'endpoint': {
                'endpointId': endpoint_id
            },
            'payload': {}
        }
    }