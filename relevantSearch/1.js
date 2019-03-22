$reqImport.$inject = ["$http", "$shop", "$log", "videoManager"];

function $reqImport($http, $shop, $log, videoManager) {
    const _this = this;

    function getActiveFields(file) {
        const activeFields = [];
        for (let i = 0; i < file.fields.length; ++i) {
            if (file.fields[i].val) {
                activeFields.push(file.fields[i]);
            }
        }
        return activeFields;
    }

    const translatedPriceType = [
        {
            default: "фиксированная",
            primaryValue: ["фіксована", "fixed"]
        },
        {
            default: "возможен торг",
            primaryValue: ["auction available", "можливий торг"]
        },
        {
            default: "отдам даром",
            primaryValue: ["віддам безплатно", "for free"]
        },
        {
            default: "сбор на ростовку",
            primaryValue: ["wholesale", "збір на ростовку"]
        },
        {
            default: "по договоренности",
            primaryValue: ["for a deal", "по домовленості"]
        }
    ];

    const typeOfCurrency = [
        {
            default: "UAH",
            primaryValue: ["Українська гривня", "Украинская гривна"]
        },
        {
            default: "USD",
            primaryValue: ["Американський долар", "Американский доллар"]
        },
        {
            default: "EUR",
            primaryValue: ["Євро", "Евро"]
        },
        {
            default: "RUB",
            primaryValue: ["Російський рубль", "Российский рубль"]
        },
        {
            default: "BYN",
            primaryValue: ["Білоруський рубль", "Белорусский рубль"]
        }
    ];
    const categoryFile = [
        {
            default: "57eb7e4b4f1b0f6e76603e83",
            primaryValue: ["Одяг та взуття", "Одежда и обувь", "Clothes"]
        },
        {
            default: "5835b6ce1baeeefdc0482dcb",
            primaryValue: ["Зоотовари", "Зоотовары", "Goods for animals"]
        },
        {
            default: "57eb7e4b4f1b0f6e76603e88",
            primaryValue: ["Автотовари", "Автотовары", "Car goods"]
        }
    ];

    const subCategoryFile = [
        {
            default: "5808e35978192c892f1fe2ff",
            primaryValue: ["автоелектроніка", "автоелектроника", "auto-electrics"]
        },
        {
            default: "583ee2ce4e10bb103dba2444",
            primaryValue: ["зерна", "зерна", "semis"]
        },
        {
            default: "592310c13aba7b0d288634ad",
            primaryValue: ["прикраси", "украшения", "jewelry"]
        }
    ];

    function validCategory(file) {
        if (file.headings.includes("Категорія товару")) {
            file.rows.map(row => {
                const id = row["Категорія товару"];
                if (id !== "undefined") {
                    categoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Категорія товару"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("Категория товара")) {
            file.rows.map(row => {
                const id = row["Категория товара"];
                if (id !== "undefined") {
                    categoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Категория товара"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("mainGroup")) {
            file.rows.map(row => {
                const id = row.mainGroup;
                if (id !== "undefined") {
                    categoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row.mainGroup = item.default;
                        }
                    });
                }
            });
            return file;
        }
    }

    function validSubCategory(file) {
        if (file.headings.includes("Підкатегорія товару")) {
            file.rows.map(row => {
                const id = row["Підкатегорія товару"];
                if (id !== "undefined") {
                    subCategoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Підкатегорія товару"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("Подкатегорія товара")) {
            file.rows.map(row => {
                const id = row["Подкатегорія товара"];
                if (id !== "undefined") {
                    subCategoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Подкатегорія товара"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("subGroup")) {
            file.rows.map(row => {
                const id = row.subGroup;
                if (id !== "undefined") {
                    subCategoryFile.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row.subGroup = item.default;
                        }
                    });
                }
            });
            return file;
        }
    }

    function convertTypePrice(file) {
        if (file.headings.includes("Тип ціни")) {
            file.rows.map(row => {
                const id = row["Тип ціни"];
                if (id !== "undefined") {
                    translatedPriceType.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Тип ціни"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("Тип цены")) {
            file.rows.map(row => {
                const id = row["Тип цены"];
                if (id !== "undefined") {
                    translatedPriceType.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Тип цены"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("Type of price")) {
            file.rows.map(row => {
                const id = row["Type of price"];
                if (id !== "undefined") {
                    translatedPriceType.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Type of price"] = item.default;
                        }
                    });
                }
            });
            return file;
        }
    }

    function convertCurrency(file) {
        if (file.headings.includes("Валюта")) {
            file.rows.map(row => {
                const id = row["Валюта"];
                if (id !== "undefined") {
                    typeOfCurrency.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row["Валюта"] = item.default;
                        }
                    });
                }
            });
            return file;
        } else if (file.headings.includes("Currency")) {
            file.rows.map(row => {
                const id = row.Currency;
                if (id !== "undefined") {
                    typeOfCurrency.forEach(item => {
                        if (item.primaryValue.indexOf(id) !== -1) {
                            row.Currency = item.default;
                        }
                    });
                }
            });
            return file;
        }
    }

    function changeUserFile(file) {
        const correctCategory = validCategory(file);
        const correctSubCategory = validSubCategory(correctCategory);
        const typePrice = convertTypePrice(correctSubCategory);
        return convertCurrency(typePrice);
    }

    //
    function buildGoodsArray(file) {
        const activeFields = getActiveFields(file);
        const data = JSON.parse(JSON.stringify(file));
        console.log("look at file", file);
        console.log("look at data", data);
        const converted = changeUserFile(data);
        const _file = [];
        for (let j = 0; j < converted.rows.length; ++j) {
            const _good = {};
            for (let k = 0; k < activeFields.length; ++k) {
                if (activeFields[k].alias) {
                    if (
                        activeFields[k].action === "pictures" &&
                        typeof converted.rows[j][activeFields[k].alias] !== "undefined"
                    ) {
                        _good[activeFields[k].action] = converted.rows[j][
                            activeFields[k].alias
                            ].split(",");
                    } else if (
                        activeFields[k].action === "price" &&
                        typeof converted.rows[j][activeFields[k].alias] !== "undefined"
                    ) {
                        _good[activeFields[k].action] =
                            parseInt(converted.rows[j][activeFields[k].alias]) * 100;
                    } else {
                        _good[activeFields[k].action] =
                            converted.rows[j][activeFields[k].alias];
                    }
                }
            }
            _good.fileName = converted.name;
            _file.push(_good);
        }
        return _file;
    }

    function buildFilesArray(files) {
        let _files = [];
        for (let i = 0; i < files.length; ++i) {
            _files = _files.concat(buildGoodsArray(files[i]));
        }
        return _files;
    }

    function postSingleFileImport(file) {
        const _goods = buildGoodsArray(file);
        return $http
            .post(`${WP.SHOP_API_DOMAIN}api/import/${$shop.$my().id}`, {
                data: _goods
            })
            .catch(err => {
                err && $log.warn(err);
            });
    }

    function createVideoInDb(good) {
        return new Promise((resolve, rej) =>
            videoManager.getInfoByUrl(good.videos).then(res =>
                videoManager.addVideo(res).then(res => {
                    good.videos = res.id;
                    resolve(good);
                })
            )
        );
    }

    function postMultipleFilesImport(files) {
        const goods = buildFilesArray(files);
        const promisesVideoArray = [];

        goods.forEach(good => {
            if (good.videos !== undefined) {
                promisesVideoArray.push(createVideoInDb(good));
            }
        });

        return Promise.all(promisesVideoArray).then(newData =>
            $http
                .post(`${WP.SHOP_API_DOMAIN}api/import/${$shop.$my().id}`, {
                    data: goods
                })
                .catch(err => {
                    err && $log.warn(err);
                })
        );
    }

    function putSingleFileImport(file) {
        const _goods = buildGoodsArray(file);
        return $http
            .put(`${WP.SHOP_API_DOMAIN}api/import/${$shop.$my().id}`, {
                data: _goods
            })
            .catch(err => {
                err && $log.warn(err);
            });
    }

    function putMultipleFilesImport(files) {
        const _goods = buildFilesArray(files);
        return $http
            .put(`${WP.SHOP_API_DOMAIN}api/import/${$shop.$my().id}`, {
                data: _goods
            })
            .catch(err => {
                err && $log.warn(err);
            });
    }

    _this.postSingleFileImport = postSingleFileImport;
    _this.postMultipleFilesImport = postMultipleFilesImport;

    _this.putSingleFileImport = putSingleFileImport;
    _this.putMultipleFilesImport = putMultipleFilesImport;

    return _this;
}

module.exports = $reqImport;




