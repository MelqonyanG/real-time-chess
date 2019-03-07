def response_json(code=200, message='OK', data=None):
    response = {
        'status': code,
        'message': message
    }
    if data:
        response['data'] = data
    return response
