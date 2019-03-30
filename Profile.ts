class Profile {

    /**
     * Exports the current profile to a file
     */
    public static exportProfile() {
        LocalFile.downloadFile("BondageCollegeProfile.json", JSON.stringify(localStorage));
    }

    /**
     * Imports a profile from a file
     */
    public static importProfile() {
        LocalFile.openFile((content) => Profile.importProfileContent(content));
    }

    private static importProfileContent(content: string) {
        const data = JSON.parse(content);

        for (const dataKey in data) {
            if (data.hasOwnProperty(dataKey)) {
                localStorage[dataKey] = data[dataKey];
            }
        }
    }

}