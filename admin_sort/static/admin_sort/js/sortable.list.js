"use strict";

var _sortablejs = _interopRequireDefault(require("sortablejs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SortableList = function () {
  'use strict';

  var widgets;
  ready(init);

  function init() {
    widgets = document.querySelectorAll('.sortable-list');

    for (var i = 0; i < widgets.length; ++i) {
      init_widget(widgets[i]);
    }
  }

  ;

  function init_widget(w) {}

  ;

  function ready(callback) {}

  ;
}();