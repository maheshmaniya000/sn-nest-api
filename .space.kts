job("Lint") {
    container(image = "node:latest") {
        shellScript {
            interpreter = "/bin/sh"
            content = """
                yarn
                yarn lint
            """
        }
    }
}
