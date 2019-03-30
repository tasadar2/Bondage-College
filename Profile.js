class Profile {
    /**
     * Exports the current profile to a file
     */
    static exportProfile() {
        LocalFile.downloadFile("BondageCollegeProfile.json", JSON.stringify(localStorage));
    }
    /**
     * Imports a profile from a file
     */
    static importProfile() {
        LocalFile.openFile((content) => Profile.importProfileContent(content));
    }
    static importProfileContent(content) {
        const data = JSON.parse(content);
        for (const dataKey in data) {
            if (data.hasOwnProperty(dataKey)) {
                localStorage[dataKey] = data[dataKey];
            }
        }
    }
}
