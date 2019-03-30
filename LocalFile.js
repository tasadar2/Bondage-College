class LocalFile {
    /**
     * Saves a file
     * @param filename Name of the file
     * @param data Content of the file
     */
    static downloadFile(filename, data) {
        const link = document.createElement("a");
        link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
        link.download = filename;
        if (document.createEvent) {
            const event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            link.dispatchEvent(event);
        }
        else {
            link.click();
        }
    }
    /**
     * Opens a file
     * @param callback Method to call upon file being selected
     */
    static openFile(callback) {
        const input = document.createElement("input");
        input.type = "file";
        input.click();
        input.onchange = (e) => this.readInput(e.target, callback);
    }
    static readInput(input, callback) {
        if (input && input.files && input.files.length === 1) {
            const reader = new FileReader();
            reader.readAsText(input.files[0], "utf-8");
            reader.onload = (readerEvent) => this.readContent(readerEvent.target, callback);
        }
    }
    static readContent(reader, callback) {
        if (reader) {
            const content = reader.result;
            if (content) {
                callback(content);
            }
        }
    }
}
