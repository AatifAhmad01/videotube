class ApiResponse {

    constructor(statusCoce, data, message = "Success") {
        this.statusCoce = statusCoce;
        this.data = data;
        this.message = message;
        this.success = statusCoce < 400;
    }
}

export default ApiResponse