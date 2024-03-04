const rapportBuildingPath = (): string => {
    const paths: string[] = [
        "rapportBuildingPath1",
        "rapportBuildingPath2",
        "rapportBuildingPath3"
    ];

    return paths[Math.floor(Math.random() * paths.length)];
};

export default rapportBuildingPath;
