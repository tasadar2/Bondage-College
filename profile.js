function downloadFile(filename, data) {
    var link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
    link.download = filename;

    if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        link.dispatchEvent(event);
    } else {
        link.click();
    }
}

function exportSaves() {
    downloadFile("BondageCollegeSaves.json", JSON.stringify(localStorage));
}

function importSaves() {
    openFile(function (content) {
        var saves = JSON.parse(content);

        for (var saveKey in saves) {
            if (saves.hasOwnProperty(saveKey)) {
                localStorage[saveKey] = saves[saveKey];
            }
        }
    });
}

function openFile(callback) {
    var input = document.createElement("input");
    input.type = "file";
    input.click();

    input.onchange = function (e) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0], "utf-8");

        reader.onload = function (readerEvent) {
            callback(readerEvent.target.result);
        };
    };
}
