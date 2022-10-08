
export default class httpServices {
    public static async respond(response, message, data, code) {
        response.status(code)
        return response.send({ data: data, message: message })
    }
}
