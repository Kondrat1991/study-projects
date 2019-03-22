"use strict";
var angular = require("angular");
var find = require("lodash/find");
var fileImportForm = {
    templateUrl: require("../../../../../views/templates/import/_file.import.component.html"),
    controller: FileImportController,
    controllerAs: "file"
};
FileImportController.$inject = [
    "$scope",
    "$reqImport",
    "$rootScope",
    "$editImported",
    "$state",
    "$shop",
    "goodsService",
    "$log",
    "$window"
];

function FileImportController($scope,
                              $reqImport,
                              $rootScope,
                              $editImported,
                              $state,
                              $shop,
                              goodsService,
                              $log,
                              $window) {
    var ctrl = this;
    ctrl.importResult = {};
    ctrl.parsedFiles = [];
    ctrl.tempFile = [];
    ctrl.onParsed = onParsed;
    ctrl.importCurrentFile = importCurrentFile;
    ctrl.importAllFiles = importAllFiles;
    $scope.emptyField = true;
    ctrl.goodFields = [
        // {
        //   action: 'id',
        //   val: true,
        //   text: 'Ідентифікатор товару',
        //   aliases: [
        //     'Ідентифікатор товару',
        //     'Ідентифікатор_товару',
        //     'id',
        //     '_id'
        //   ],
        //   alias: null
        // }
        {
            action: "title",
            val: true,
            text: "Назва товару",
            aliases: ["Назва товару", "Название_позиции", "Название позиции", "Name"],
            alias: null,
            disabled: true
        },
        {
            action: "description",
            val: true,
            text: "Опис товару",
            aliases: ["Опис товару", "Описание", "Description"],
            alias: null,
            disabled: true
        },
        {
            action: "price",
            val: true,
            text: "Ціна",
            aliases: ["Ціна", "Цена", "Price"],
            alias: null,
            disabled: true
        },
        {
            action: "currency",
            val: true,
            text: "Валюта",
            aliases: ["Валюта", "Currency"],
            alias: null,
            disabled: true
        },
        {
            action: "typePrice",
            val: true,
            text: "Тип ціни",
            aliases: ["Тип ціни", "Тип цены", "Type of price"],
            alias: null,
            disabled: true
        },
        {
            action: "mainGroup",
            val: true,
            text: "Категорія товару",
            aliases: [
                "Категорія товару",
                "Категория товара",
                "Категорія_товару",
                "mainGroup",
                "main_group"
            ],
            alias: null,
            disabled: true
        },
        {
            action: "subGroup",
            val: true,
            text: "Підкатегорія товару",
            aliases: ["Підкатегорія товару", "subGroup", "Подкатегорія товара"],
            alias: null,
            disabled: true
        },
        {
            action: "serialNumber",
            val: false,
            text: "Артикул (серийный номер)",
            aliases: [
                "serialNumber",
                "Артикул (серійний номер)",
                "Артикул (серийный номер)",
                "Код_товара",
                "серійний номер",
                "серійний_номер",
                "Артикул",
                "Артикул(серійний номер,)"
            ],
            alias: null,
            disabled: false
        },
        {
            action: "pictures",
            val: true,
            text: "Посилання на зображення",
            aliases: ["Посилання на зображення", "Изображения", "Pictures"],
            alias: null,
            disabled: false
        },
        {
            action: "videos",
            val: true,
            text: "Посилання на відео",
            aliases: ["Посилання на відео", "Видео", "Videos"],
            alias: null,
            disabled: false
        }
    ];
    ctrl.options = [
        {
            title: "Действие относительно списка:",
            id: 1,
            type: "radio",
            value: "create",
            values: [
                {
                    action: "create",
                    val: "create",
                    text: "Добавить новые товары"
                },
                {
                    action: "update",
                    val: "update",
                    text: "Обновить существующие"
                }
            ]
        },
        {
            title: "Обновить только:",
            type: "checkbox",
            value: null,
            values: ctrl.goodFields
        }
    ];

    ctrl.editItem = editItem;
    ctrl.createItem = createItem;
    ctrl.viewItem = viewItem;
    ctrl.removeItem = removeItem;

    function onParsed(file) {
        file.fields = [];
        angular.copy(ctrl.goodFields, file.fields);
        setupAliases(file);
        file.imported = false;
        var index = ctrl.parsedFiles.objIndexOf("name", file.name);
        if (index === -1) {
            ctrl.tempFile.push(file);
            $scope.emptyField = false;
        } else {
            ctrl.parsedFiles[index] = file;
            $scope.emptyField = false;
        }
        $scope.$apply();
    }

    $scope.chosenFile = function() {
        ctrl.parsedFiles.push(ctrl.tempFile[ctrl.tempFile.length - 1]);
        angular.element("input[type='file']").val(null);
        $scope.emptyField = true;
    };

    function setupAliases(file) {
        for (var key = 0; key < file.fields.length; ++key) {
            file.fields[key].alias = find(file.headings, function(item) {
                var _index = file.fields[key].aliases.indexOf(item);
                if (_index !== -1) {
                    return item === file.fields[key].aliases[_index];
                }
                return false;
            }) || null;
        }
    }

    function importCurrentFile(file) {
        switch (ctrl.options[0].value) {
            case "create":
                createFromFile(file);
                break;
            case "update":
                updateFromFile(file);
                break;
            default:
                break;
        }
    }

    function importAllFiles() {
        switch (ctrl.options[0].value) {
            case "create":
                createFromFiles();
                break;
            case "update":
                updateFromFiles();
                break;
            default:
                break;
        }
    }

    function createFromFile(file) {
        $reqImport.postSingleFileImport(file)
            .then(function(response) {
                angular.copy(response.data, ctrl.importResult);
                ctrl.parsedFiles = [];
            })
            .catch(function(err) {
                err && $log.warn(err);
                $rootScope.$broadcast("notification", {
                    text: "NOTIFICATION.ERROR_WHILE_IMPORT_FROM_FILE",
                    type: "danger"
                });
            });
    }

    function updateFromFile(file) {
        $reqImport.putSingleFileImport(file)
            .then(function(response) {
                angular.copy(response.data, ctrl.importResult);
                ctrl.parsedFiles = [];
            })
            .catch(function(err) {
                err && $log.warn(err);
                $rootScope.$broadcast("notification", {
                    text: "NOTIFICATION.ERROR_WHILE_IMPORT_FROM_FILE",
                    type: "danger"
                });
            });
    }

    function createFromFiles() {
        $reqImport.postMultipleFilesImport(ctrl.parsedFiles)
            .then(function(response) {
                angular.copy(response.data, ctrl.importResult);
                ctrl.parsedFiles = [];
            })
            .catch(function(err) {
                err && $log.warn(err);
                $rootScope.$broadcast("notification", {
                    text: "NOTIFICATION.ERROR_WHILE_IMPORT_FROM_FILE",
                    type: "danger"
                });
            });
    }

    function updateFromFiles() {
        $reqImport.putMultipleFilesImport(ctrl.parsedFiles)
            .then(function(response) {
                angular.copy(response.data, ctrl.importResult);
                ctrl.parsedFiles = [];
            })
            .catch(function(err) {
                err && $log.warn(err);
                $rootScope.$broadcast("notification", {
                    text: "NOTIFICATION.ERROR_WHILE_IMPORT_FROM_FILE",
                    type: "danger"
                });
            });
    }

    function createItem(item) {
        $editImported.setTempGood(item);
        var url = $state.href("addGoods", { name: $shop.$my().shopName }, { absolute: true });
        $window.open(url, "_blank");
    }

    function editItem(item) {
        // $editImported.setTempGood(item);
        var url = $state.href("updateGood",
            { name: $shop.$my().shopName, goodName: item.url },
            { absolute: true });
        $window.open(url, "_blank");
    }

    function viewItem(item) {
        // $editImported.setTempGood(item);
        var url = $state.href("viewGood",
            { name: $shop.$my().shopName, goodName: item.url },
            { absolute: true });
        $window.open(url, "_blank");
    }

    function removeItem(ctx) {
        goodsService.deleteGood(ctx.row.item.id)
            .then(function(response) {
                if (response.status === 200) {
                    // $shop.$init().then(function () {
                    //   $state.go('allGoods');
                    // });
                    ctrl.importResult.success.splice(ctx.$index, 1);
                }
            })
            .catch(function(err) {
                err && $log.warn(err);
            });
    }
}

module.exports = fileImportForm;
