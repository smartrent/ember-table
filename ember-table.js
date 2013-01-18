// Generated by CoffeeScript 1.4.0
(function() {

  (function($) {
    return $.getScrollbarWidth = function() {
      var $div, $textarea1, $textarea2, scrollbarWidth;
      scrollbarWidth = 0;
      if (!scrollbarWidth) {
        if ($.browser.msie) {
          $textarea1 = $("<textarea cols=\"10\" rows=\"2\"></textarea>").css({
            position: "absolute",
            top: -1000,
            left: -1000
          }).appendTo("body");
          $textarea2 = $("<textarea cols=\"10\" rows=\"2\" style=\"overflow: hidden;\"></textarea>").css({
            position: "absolute",
            top: -1000,
            left: -1000
          }).appendTo("body");
          scrollbarWidth = $textarea1.width() - $textarea2.width();
          $textarea1.add($textarea2).remove();
        } else {
          $div = $("<div />").css({
            width: 100,
            height: 100,
            overflow: "auto",
            position: "absolute",
            top: -1000,
            left: -1000
          }).prependTo("body").append("<div />").find("div").css({
            width: "100%",
            height: 200
          });
          scrollbarWidth = 100 - $div.width();
          $div.parent().remove();
        }
      }
      return scrollbarWidth;
    };
  })(jQuery);

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {
  var debounce;

  Ember.ResizeHandler = Ember.Mixin.create({
    resizeEndDelay: 200,
    resizing: false,
    onResizeStart: Ember.K,
    onResizeEnd: Ember.K,
    onResize: Ember.K,
    debounceResizeEnd: Ember.computed(function() {
      var _this = this;
      return debounce(function(event) {
        _this.set('resizing', false);
        return typeof _this.onResizeEnd === "function" ? _this.onResizeEnd(event) : void 0;
      }, this.get('resizeEndDelay'));
    }).property('resizeEndDelay'),
    resizeHandler: Ember.computed(function() {
      return jQuery.proxy(this.handleWindowResize, this);
    }).property(),
    handleWindowResize: function(event) {
      if (!this.get('resizing')) {
        this.set('resizing', true);
        if (typeof this.onResizeStart === "function") {
          this.onResizeStart(event);
        }
      }
      if (typeof this.onResize === "function") {
        this.onResize(event);
      }
      return this.get('debounceResizeEnd')(event);
    },
    didInsertElement: function() {
      this._super();
      return $(window).bind('resize', this.get("resizeHandler"));
    },
    willDestroy: function() {
      $(window).unbind('resize', this.get("resizeHandler"));
      return this._super();
    }
  });

  debounce = function(func, wait, immediate) {
    var result, timeout;
    timeout = result = null;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          return result = func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  };

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.StyleBindingsMixin = Ember.Mixin.create({
    concatenatedProperties: ['styleBindings'],
    attributeBindings: ['style'],
    unitType: 'px',
    createStyleString: function(styleName, property) {
      var value;
      value = this.get(property);
      if (value === void 0) {
        return;
      }
      if (Ember.typeOf(value) === 'number') {
        value = value + this.get('unitType');
      }
      return "" + styleName + ":" + value + ";";
    },
    applyStyleBindings: function() {
      var lookup, properties, styleBindings, styleComputed, styles,
        _this = this;
      styleBindings = this.styleBindings;
      if (!styleBindings) {
        return;
      }
      lookup = {};
      styleBindings.forEach(function(binding) {
        var property, style, _ref;
        _ref = binding.split(':'), property = _ref[0], style = _ref[1];
        return lookup[style || property] = property;
      });
      styles = Ember.keys(lookup);
      properties = styles.map(function(style) {
        return lookup[style];
      });
      styleComputed = Ember.computed(function() {
        var styleString, styleTokens;
        styleTokens = styles.map(function(style) {
          return _this.createStyleString(style, lookup[style]);
        });
        styleString = styleTokens.join('');
        if (styleString.length !== 0) {
          return styleString;
        }
      });
      styleComputed.property.apply(styleComputed, properties);
      return Ember.defineProperty(this, 'style', styleComputed);
    },
    init: function() {
      this.applyStyleBindings();
      return this._super();
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.LazyContainerView = Ember.ContainerView.extend(Ember.StyleBindingsMixin, {
    classNames: 'lazy-list-container',
    styleBindings: ['height'],
    content: null,
    itemViewClass: null,
    rowHeight: null,
    scrollTop: null,
    startIndex: null,
    init: function() {
      this._super();
      return this.onNumChildViewsDidChange();
    },
    height: Ember.computed(function() {
      return this.get('content.length') * this.get('rowHeight');
    }).property('content.length', 'rowHeight'),
    numChildViews: Ember.computed(function() {
      return this.get('numItemsShowing') + 2;
    }).property('numItemsShowing'),
    onNumChildViewsDidChange: Ember.observer(function() {
      var childViews, itemViewClass, newNumViews, numViewsToInsert, oldNumViews, viewsToAdd, viewsToRemove, _i, _results;
      itemViewClass = Ember.get(this.get('itemViewClass'));
      newNumViews = this.get('numChildViews');
      if (!(itemViewClass && newNumViews)) {
        return;
      }
      childViews = this.get('childViews');
      oldNumViews = this.get('childViews.length');
      numViewsToInsert = newNumViews - oldNumViews;
      if (numViewsToInsert < 0) {
        viewsToRemove = childViews.slice(newNumViews, oldNumViews);
        return childViews.removeObjects(viewsToRemove);
      } else if (numViewsToInsert > 0) {
        viewsToAdd = (function() {
          _results = [];
          for (var _i = 0; 0 <= numViewsToInsert ? _i < numViewsToInsert : _i > numViewsToInsert; 0 <= numViewsToInsert ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return itemViewClass.create();
        });
        return childViews.pushObjects(viewsToAdd);
      }
    }, 'numChildViews', 'itemViewClass'),
    viewportDidChange: Ember.observer(function() {
      var content, numShownViews, startIndex, views;
      content = this.get('content') || [];
      views = this.get('childViews') || [];
      startIndex = this.get('startIndex');
      numShownViews = Math.min(views.get('length'), content.get('length'));
      return views.forEach(function(childView, i) {
        var item, itemIndex;
        if (i >= numShownViews) {
          childView = views.objectAt(i);
          childView.set('content', null);
          return;
        }
        itemIndex = startIndex + i;
        childView = views.objectAt(itemIndex % numShownViews);
        item = content.objectAt(itemIndex);
        if (item !== childView.get('content')) {
          childView.teardownContent();
          childView.set('itemIndex', itemIndex);
          childView.set('content', item);
          return childView.prepareContent();
        }
      });
    }, 'content', 'childViews.length', 'startIndex')
  });

  Ember.LazyItemView = Ember.View.extend(Ember.StyleBindingsMixin, {
    itemIndex: null,
    prepareContent: Ember.K,
    teardownContent: Ember.K,
    rowHeightBinding: 'parentView.rowHeight',
    styleBindings: ['width', 'top', 'display'],
    top: Ember.computed(function() {
      return this.get('itemIndex') * this.get('rowHeight');
    }).property('itemIndex', 'rowHeight'),
    display: Ember.computed(function() {
      if (!this.get('content')) {
        return 'none';
      }
    }).property('content')
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.MultiItemViewCollectionView = Ember.CollectionView.extend({
    itemViewClassField: null,
    createChildView: function(view, attrs) {
      var itemViewClass, itemViewClassField;
      itemViewClassField = this.get('itemViewClassField');
      itemViewClass = attrs.content.get(itemViewClassField);
      if (typeof itemViewClass === 'string') {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      }
      return this._super(itemViewClass, attrs);
    }
  });

  Ember.MouseWheelHandlerMixin = Ember.Mixin.create({
    onMouseWheel: Ember.K,
    didInsertElement: function() {
      var _this = this;
      this._super();
      return this.$().bind('mousewheel', function(event, delta, deltaX, deltaY) {
        return Ember.run(_this, _this.onMouseWheel, event, delta, deltaX, deltaY);
      });
    },
    willDestroy: function() {
      var _ref;
      if ((_ref = this.$()) != null) {
        _ref.unbind('mousewheel');
      }
      return this._super();
    }
  });

  Ember.ScrollHandlerMixin = Ember.Mixin.create({
    onScroll: Ember.K,
    didInsertElement: function() {
      var _this = this;
      this._super();
      return this.$().bind('scroll', function(event) {
        return Ember.run(_this, _this.onScroll, event);
      });
    },
    willDestroy: function() {
      var _ref;
      if ((_ref = this.$()) != null) {
        _ref.unbind('scroll');
      }
      return this._super();
    }
  });

}).call(this);
;Ember.TEMPLATES["tables-container"]=Ember.Handlebars.compile("\n  {{#if controller.hasHeader}}\n    {{view Ember.Table.HeaderTableContainer}}\n  {{/if}}\n  {{view Ember.Table.BodyTableContainer}}\n  {{#if controller.hasFooter}}\n    {{view Ember.Table.FooterTableContainer}}\n  {{/if}}\n  {{view Ember.Table.ScrollContainer}}");
Ember.TEMPLATES["scroll-container"]=Ember.Handlebars.compile("\n  {{view Ember.Table.ScrollPanel}}");
Ember.TEMPLATES["header-container"]=Ember.Handlebars.compile("\n  <div class='table-fixed-wrapper'>\n    {{view Ember.Table.HeaderBlock classNames=\"left-table-block\"\n      columnsBinding=\"controller.fixedColumns\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      heightBinding=\"controller.headerHeight\"\n    }}\n    {{view Ember.Table.HeaderBlock classNames=\"right-table-block\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      heightBinding=\"controller.headerHeight\"\n    }}\n  </div>");
Ember.TEMPLATES["body-container"]=Ember.Handlebars.compile("\n  <div class='table-scrollable-wrapper'>\n    {{view Ember.Table.LazyTableBlock classNames=\"left-table-block\"\n      contentBinding=\"controller.bodyContent\"\n      columnsBinding=\"controller.fixedColumns\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      numItemsShowingBinding=\"controller._numItemsShowing\"\n      scrollTopBinding=\"controller._scrollTop\"\n      startIndexBinding=\"controller._startIndex\"\n    }}\n    {{view Ember.Table.LazyTableBlock classNames=\"right-table-block\"\n      contentBinding=\"controller.bodyContent\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      numItemsShowingBinding=\"controller._numItemsShowing\"\n      scrollTopBinding=\"controller._scrollTop\"\n      startIndexBinding=\"controller._startIndex\"\n    }}\n  </div>");
Ember.TEMPLATES["footer-container"]=Ember.Handlebars.compile("\n  <div class='table-fixed-wrapper'>\n    {{view Ember.Table.TableBlock classNames=\"left-table-block\"\n      contentBinding=\"controller.footerContent\"\n      columnsBinding=\"controller.fixedColumns\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      heightBinding=\"controller.footerHeight\"\n    }}\n    {{view Ember.Table.TableBlock classNames=\"right-table-block\"\n      contentBinding=\"controller.footerContent\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      heightBinding=\"controller.footerHeight\"\n    }}\n  </div>");
Ember.TEMPLATES["table-row"]=Ember.Handlebars.compile("\n  {{view Ember.MultiItemViewCollectionView\n    rowBinding=\"view.row\"\n    contentBinding=\"view.columns\"\n    itemViewClassField=\"tableCellViewClass\"\n    widthBinding=\"controller._tableColumnsWidth\"\n  }}");
Ember.TEMPLATES["table-cell"]=Ember.Handlebars.compile("\n  <span class='content'>{{view.cellContent}}</span>");
Ember.TEMPLATES["header-row"]=Ember.Handlebars.compile("\n  {{view Ember.MultiItemViewCollectionView\n    contentBinding=\"view.content\"\n    itemViewClassField=\"headerCellViewClass\"\n  }}");
Ember.TEMPLATES["header-cell"]=Ember.Handlebars.compile("\n  <span {{action sortByColumn target=\"controller\"}}>\n    {{view.content.headerCellName}}\n  </span>");
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.Table = Ember.Namespace.create();

  Ember.Table.ColumnDefinition = Ember.Object.extend({
    headerCellName: null,
    columnWidth: 150,
    headerCellViewClass: 'Ember.Table.HeaderCell',
    tableCellViewClass: 'Ember.Table.TableCell',
    getCellContent: Ember.required(Function),
    setCellContent: Ember.K
  });

  Ember.Table.Row = Ember.ObjectController.extend({
    content: null,
    isHovering: false,
    isSelected: false,
    isShowing: true
  });

  Ember.Table.RowArrayProxy = Ember.ArrayProxy.extend({
    tableRowClass: null,
    content: null,
    rowContent: Ember.computed(function() {
      return Ember.A();
    }).property(),
    objectAt: function(idx) {
      var item, row, tableRowClass;
      row = this.get('rowContent')[idx];
      if (row) {
        return row;
      }
      tableRowClass = this.get('tableRowClass');
      item = this.get('content').objectAt(idx);
      row = tableRowClass.create({
        content: item
      });
      this.get('rowContent')[idx] = row;
      return row;
    }
  });

  Ember.Table.TableController = Ember.Controller.extend({
    columns: null,
    numFixedColumns: 0,
    numFooterRow: 0,
    rowHeight: 30,
    headerHeight: 50,
    footerHeight: 30,
    hasHeader: true,
    hasFooter: true,
    tableRowClass: 'Ember.Table.Row',
    bodyContent: Ember.computed(function() {
      var tableRowClass;
      tableRowClass = this.get('tableRowClass');
      if (typeof tableRowClass === 'string') {
        tableRowClass = Ember.get(Ember.lookup, tableRowClass);
      }
      return Ember.Table.RowArrayProxy.create({
        tableRowClass: tableRowClass,
        content: this.get('content')
      });
    }).property('content', 'tableRowClass'),
    footerContent: Ember.computed(function(key, value) {
      if (value) {
        return value;
      } else {
        return Ember.A();
      }
    }).property(),
    fixedColumns: Ember.computed(function() {
      var columns, numFixedColumns;
      columns = this.get('columns');
      if (!columns) {
        return Ember.A();
      }
      numFixedColumns = this.get('numFixedColumns') || 0;
      return columns.slice(0, numFixedColumns);
    }).property('columns.@each', 'numFixedColumns'),
    tableColumns: Ember.computed(function() {
      var columns, numFixedColumns;
      columns = this.get('columns');
      if (!columns) {
        return Ember.A();
      }
      numFixedColumns = this.get('numFixedColumns') || 0;
      return columns.slice(numFixedColumns, columns.get('length'));
    }).property('columns.@each', 'numFixedColumns'),
    sortByColumn: Ember.K,
    _tableScrollTop: 0,
    _tableScrollLeft: 0,
    _width: null,
    _height: null,
    _scrollbarSize: null,
    _fixedColumnsWidth: Ember.computed(function() {
      return this._getTotalWidth(this.get('fixedColumns'));
    }).property('fixedColumns.@each.columnWidth'),
    _tableColumnsWidth: Ember.computed(function() {
      return this._getTotalWidth(this.get('tableColumns'));
    }).property('tableColumns.@each.columnWidth'),
    _rowWidth: Ember.computed(function() {
      var columnsWidth, nonFixedTableWidth;
      columnsWidth = this.get('_tableColumnsWidth');
      nonFixedTableWidth = this.get('_tableContainerWidth') - this.get('_fixedColumnsWidth');
      if (columnsWidth < nonFixedTableWidth) {
        return nonFixedTableWidth;
      }
      return columnsWidth;
    }).property('_fixedColumnsWidth', '_tableColumnsWidth', '_tableContainerWidth'),
    _bodyHeight: Ember.computed(function() {
      var bodyHeight, footerHeight, headerHeight, scrollbarSize;
      bodyHeight = this.get('_height');
      headerHeight = this.get('headerHeight');
      footerHeight = this.get('footerHeight');
      scrollbarSize = this.get('_scrollbarSize');
      if (this.get('_tableColumnsWidth') > this.get('_width') - this.get('_fixedColumnsWidth')) {
        bodyHeight -= scrollbarSize;
      }
      if (this.get('hasHeader')) {
        bodyHeight -= headerHeight;
      }
      if (this.get('hasFooter')) {
        bodyHeight -= footerHeight;
      }
      return bodyHeight;
    }).property('_height', 'headerHeight', 'footerHeight', '_scrollbarSize', 'hasHeader', 'hasFooter', '_tableColumnsWidth', '_width', '_fixedColumnsWidth'),
    _tableBlockWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_fixedColumnsWidth') - this.get('_scrollbarSize');
    }).property('_width', '_fixedColumnsWidth', '_scrollbarSize'),
    _fixedBlockWidthBinding: '_fixedColumnsWidth',
    _tableContentHeight: Ember.computed(function() {
      return this.get('rowHeight') * this.get('bodyContent.length');
    }).property('rowHeight', 'bodyContent.length'),
    _tableContainerWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_scrollbarSize');
    }).property('_width', '_scrollbarSize'),
    _scrollContainerWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_fixedColumnsWidth') - this.get('_scrollbarSize');
    }).property('_width', '_fixedColumnsWidth', '_scrollbarSize'),
    _scrollContainerHeight: Ember.computed(function() {
      var containerHeight;
      return containerHeight = this.get('_height') - this.get('headerHeight');
    }).property('_height', 'headerHeight'),
    _numItemsShowing: Ember.computed(function() {
      return Math.floor(this.get('_bodyHeight') / this.get('rowHeight'));
    }).property('_bodyHeight', 'rowHeight'),
    _startIndex: Ember.computed(function() {
      var index, numContent, numViews, rowHeight, scrollTop;
      numContent = this.get('bodyContent.length');
      numViews = this.get('_numItemsShowing');
      rowHeight = this.get('rowHeight');
      scrollTop = this.get('_tableScrollTop');
      index = Math.floor(scrollTop / rowHeight);
      if (index + numViews >= numContent) {
        index = numContent - numViews;
      }
      if (index < 0) {
        return 0;
      } else {
        return index;
      }
    }).property('bodyContent.length', '_numItemsShowing', 'rowHeight', '_tableScrollTop'),
    _getTotalWidth: function(columns) {
      var widths;
      if (!columns) {
        return 0;
      }
      widths = columns.getEach('columnWidth') || [];
      return widths.reduce((function(total, w) {
        return total + w;
      }), 0);
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {
  var indexesOf;

  indexesOf = Ember.EnumerableUtils.indexesOf;

  Ember.Table.RowSelectionMixin = Ember.Mixin.create({
    attributeBindings: 'tabindex',
    contentBinding: Ember.Binding.oneWay('controller.bodyContent'),
    rowHeightBinding: Ember.Binding.oneWay('controller.rowHeight'),
    numItemsShowingBinding: Ember.Binding.oneWay('controller._numItemsShowing'),
    startIndexBinding: Ember.Binding.oneWay('controller._startIndex'),
    scrollTopBinding: 'controller._tableScrollTop',
    tabindex: -1,
    KEY_EVENTS: {
      37: 'leftArrowPressed',
      38: 'upArrowPressed',
      39: 'rightArrowPressed',
      40: 'downArrowPressed'
    },
    selection: Ember.computed(function(key, value) {
      var content, indices, selection;
      content = this.get('content') || [];
      selection = this.get('selectionIndices');
      value = value || [];
      if (arguments.length === 1) {
        value = selection.map(function(index) {
          return content.objectAt(index);
        });
      } else {
        indices = indexesOf(content, value);
        selection.addObjects(indices);
      }
      return value;
    }).property('selectionIndices.[]'),
    selectionIndices: Ember.computed(function() {
      var set;
      set = new Ember.Set();
      set.addEnumerableObserver(this);
      return set;
    }).property(),
    enumerableDidChange: Ember.K,
    enumerableWillChange: function(set, removing, adding) {
      var content;
      content = this.get('content');
      if ('number' === typeof removing) {
        set.forEach(function(index) {
          return content.objectAt(index).set('selected', false);
        });
      } else if (removing) {
        removing.forEach(function(index) {
          return content.objectAt(index).set('selected', false);
        });
      }
      if (adding && 'number' !== typeof adding) {
        return adding.forEach(function(index) {
          return content.objectAt(index).set('selected', true);
        });
      }
    },
    mouseDown: function(event) {
      var index, sel;
      index = this.getIndexForEvent(event);
      sel = this.get('selectionIndices');
      if (sel.contains(index) && sel.length === 1) {
        return sel.clear();
      }
      return this.setSelectionIndex(index);
    },
    keyDown: function(event) {
      var map, method, _ref;
      map = this.get('KEY_EVENTS');
      method = map[event.keyCode];
      if (method) {
        return (_ref = this.get(method)) != null ? _ref.apply(this, arguments) : void 0;
      }
    },
    upArrowPressed: function(event) {
      var index, sel;
      event.preventDefault();
      sel = this.get('selectionIndices.lastObject');
      index = event.ctrlKey || event.metaKey ? 0 : sel - 1;
      return this.setSelectionIndex(index);
    },
    downArrowPressed: function(event) {
      var clen, index, sel;
      event.preventDefault();
      sel = this.get('selectionIndices.lastObject');
      clen = this.get('content.length');
      index = event.ctrlKey || event.metaKey ? clen - 1 : sel + 1;
      return this.setSelectionIndex(index);
    },
    getIndexForEvent: function(event) {
      return this.getRowIndexFast(this.getRowForEvent(event));
    },
    getRowForEvent: function(event) {
      var $rowView, view;
      $rowView = $(event.target).parents('.table-row');
      view = Ember.View.views[$rowView.attr('id')];
      if (view) {
        return view.get('row');
      }
    },
    getRowIndexFast: function(row) {
      var index, numRows, startIndex, sublist;
      startIndex = this.get('startIndex');
      numRows = this.get('numItemsShowing') + 1;
      sublist = this.get('content').slice(startIndex, startIndex + numRows);
      index = sublist.indexOf(row);
      if (index < 0) {
        return index;
      } else {
        return index + startIndex;
      }
    },
    setSelectionIndex: function(index) {
      var sel;
      if (!this.ensureIndex(index)) {
        return;
      }
      sel = this.get('selectionIndices');
      this.get('selectionIndices').clear();
      return this.toggleSelectionIndex(index);
    },
    toggleSelectionIndex: function(index) {
      var sel;
      if (!this.ensureIndex(index)) {
        return;
      }
      sel = this.get('selectionIndices');
      if (sel.contains(index)) {
        sel.remove(index);
      } else {
        sel.add(index);
      }
      return this.ensureVisible(index);
    },
    ensureIndex: function(index) {
      var clen;
      clen = this.get('content.length');
      return index >= 0 && index < clen;
    },
    ensureVisible: function(index) {
      var endIndex, numRows, startIndex;
      startIndex = this.get('startIndex');
      numRows = this.get('numItemsShowing');
      endIndex = startIndex + numRows;
      if (index < startIndex) {
        return this.scrollToRowIndex(index);
      } else if (index >= endIndex) {
        return this.scrollToRowIndex(index - numRows + 1);
      }
    },
    scrollToRowIndex: function(index) {
      var rowHeight, scrollTop;
      rowHeight = this.get('rowHeight');
      scrollTop = index * rowHeight;
      return this.set('scrollTop', scrollTop);
    }
  });

  Ember.Table.RowMultiSelectionMixin = Ember.Mixin.create(Ember.Table.RowSelectionMixin, {
    selectionRange: void 0,
    enumerableDidChange: function(set, removing, adding) {
      if ('number' === typeof removing) {
        this.set('selectionRange', void 0);
      } else if (removing) {
        this.reduceSelectionRange(removing);
      }
      if (adding && 'number' !== typeof adding) {
        return this.expandSelectionRange(adding);
      }
    },
    expandSelectionRange: function(indices) {
      var max, min, range, _ref;
      range = this.get('selectionRange');
      _ref = [Math.min.apply(null, indices), Math.max.apply(null, indices)], min = _ref[0], max = _ref[1];
      if (!range) {
        range = {
          min: min,
          max: max
        };
      }
      range = {
        min: Math.min(range.min, min),
        max: Math.max(range.max, max)
      };
      return this.set('selectionRange', range);
    },
    reduceSelectionRange: function(indices) {
      var max, min, range, _ref;
      indices = this.get('selectionIndices');
      _ref = [Math.min.apply(null, indices), Math.max.apply(null, indices)], min = _ref[0], max = _ref[1];
      range = {
        min: min,
        max: max
      };
      return this.set('selectionRange', range);
    },
    mouseDown: function(event) {
      var index, range, row;
      row = this.getRowForEvent(event);
      index = this.getRowIndexFast(row);
      if (event.ctrlKey || event.metaKey) {
        return this.toggleSelectionIndex(index);
      } else if (event.shiftKey) {
        range = this.get('selectionRange');
        if (range) {
          return this.setSelectionRange(range.min, index, index);
        }
      } else {
        return this._super(event);
      }
    },
    upArrowPressed: function(event) {
      var index, range;
      event.preventDefault();
      if (event.shiftKey) {
        range = this.get('selectionRange');
        index = range.min - 1;
        if (range) {
          return this.setSelectionRange(index, range.max, index);
        }
      } else {
        return this._super(event);
      }
    },
    downArrowPressed: function(event) {
      var index, range;
      event.preventDefault();
      if (event.shiftKey) {
        range = this.get('selectionRange');
        index = range.max + 1;
        if (range) {
          return this.setSelectionRange(range.min, index, index);
        }
      } else {
        return this._super(event);
      }
    },
    setSelectionRange: function(start, end, visibleIndex) {
      var beg, sel, _i, _results;
      if (!(this.ensureIndex(start) && this.ensureIndex(end))) {
        return;
      }
      beg = start < end ? start : end;
      end = start < end ? end : start;
      sel = this.get('selectionIndices');
      sel.clear();
      sel.addObjects((function() {
        _results = [];
        for (var _i = beg; beg <= end ? _i <= end : _i >= end; beg <= end ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this));
      return this.ensureVisible(visibleIndex);
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.Table.TablesContainer = Ember.View.extend(Ember.ResizeHandler, {
    templateName: 'tables-container',
    classNames: 'tables-container',
    didInsertElement: function() {
      var isLion, scrollBarWidth;
      this._super();
      this.elementSizeDidChange();
      scrollBarWidth = $.getScrollbarWidth();
      isLion = (typeof navigator !== "undefined" && navigator !== null ? navigator.appVersion['10_7'] : void 0) !== -1 && scrollBarWidth === 0;
      if (isLion) {
        scrollBarWidth = 8;
      }
      return this.set('controller._scrollbarSize', scrollBarWidth);
    },
    onResize: function() {
      return this.elementSizeDidChange();
    },
    elementSizeDidChange: function() {
      this.set('controller._width', this.$().width());
      return this.set('controller._height', this.$().height());
    }
  });

  Ember.Table.TableContainer = Ember.View.extend(Ember.StyleBindingsMixin, {
    classNames: ['table-container'],
    styleBindings: ['height', 'width']
  });

  Ember.Table.TableBlock = Ember.CollectionView.extend(Ember.StyleBindingsMixin, {
    classNames: ['table-block'],
    styleBindings: ['width', 'height'],
    itemViewClass: 'Ember.Table.TableRow',
    columns: null,
    content: null,
    scrollLeft: null,
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.LazyTableBlock = Ember.LazyContainerView.extend({
    classNames: ['table-block'],
    rowHeightBinding: 'controller.rowHeight',
    itemViewClass: 'Ember.Table.TableRow',
    styleBindings: ['width'],
    columns: null,
    content: null,
    scrollLeft: null,
    scrollTop: null,
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.TableRow = Ember.LazyItemView.extend({
    templateName: 'table-row',
    classNames: 'table-row',
    classNameBindings: ['row.active:active', 'row.selected:selected'],
    styleBindings: ['width', 'height'],
    rowBinding: 'content',
    columnsBinding: 'parentView.columns',
    widthBinding: 'controller._rowWidth',
    heightBinding: 'controller.rowHeight',
    mouseEnter: function(event) {
      var row;
      row = this.get('row');
      if (row) {
        return row.set('active', true);
      }
    },
    mouseLeave: function(event) {
      var row;
      row = this.get('row');
      if (row) {
        return row.set('active', false);
      }
    },
    teardownContent: function() {
      var row;
      row = this.get('row');
      if (row) {
        return row.set('active', false);
      }
    }
  });

  Ember.Table.TableCell = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'table-cell',
    classNames: ['table-cell'],
    styleBindings: ['width'],
    rowBinding: 'parentView.row',
    columnBinding: 'content',
    rowContentBinding: 'row.content',
    widthBinding: 'column.columnWidth',
    cellContent: Ember.computed(function(key, value) {
      var column, row;
      row = this.get('rowContent');
      column = this.get('column');
      if (!(row && column)) {
        return;
      }
      if (arguments.length === 1) {
        value = column.getCellContent(row);
      } else {
        column.setCellContent(row, value);
      }
      return value;
    }).property('rowContent.isLoaded', 'column')
  });

  Ember.Table.HeaderBlock = Ember.Table.TableBlock.extend({
    classNames: ['header-block'],
    itemViewClass: 'Ember.Table.HeaderRow',
    content: Ember.computed(function() {
      return [this.get('columns')];
    }).property('columns')
  });

  Ember.Table.HeaderRow = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'header-row',
    classNames: ['table-row', 'header-row'],
    styleBindings: ['height'],
    columnsBinding: 'content',
    heightBinding: 'controller.headerHeight',
    sortableOption: Ember.computed(function() {
      return {
        axis: 'x',
        cursor: 'pointer',
        helper: 'clone',
        containment: 'parent',
        placeholder: 'ui-state-highlight',
        scroll: true,
        tolerance: 'pointer',
        update: jQuery.proxy(this.onColumnSort, this)
      };
    }).property(),
    didInsertElement: function() {
      this._super();
      return this.$('> div').sortable(this.get('sortableOption'));
    },
    onColumnSort: function(event, ui) {
      var column, columns, newIndex, view;
      newIndex = ui.item.index();
      view = Ember.View.views[ui.item.attr('id')];
      columns = this.get('columns');
      column = view.get('column');
      columns.removeObject(column);
      return columns.insertAt(newIndex, column);
    }
  });

  Ember.Table.HeaderCell = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'header-cell',
    classNames: ['table-cell', 'header-cell'],
    styleBindings: ['width', 'height'],
    columnBinding: 'content',
    widthBinding: 'column.columnWidth',
    heightBinding: 'controller.headerHeight',
    resizableOption: Ember.computed(function() {
      return {
        handles: 'e',
        minHeight: 40,
        minWidth: 100,
        maxWidth: 500,
        resize: jQuery.proxy(this.onColumnResize, this)
      };
    }).property(),
    didInsertElement: function() {
      return this.$().resizable(this.get('resizableOption'));
    },
    onColumnResize: function(event, ui) {
      return this.set('width', ui.size.width);
    }
  });

  Ember.Table.HeaderTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, {
    templateName: 'header-container',
    classNames: ['table-container', 'fixed-table-container', 'header-container'],
    heightBinding: 'controller.headerHeight',
    widthBinding: 'controller._tableContainerWidth',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.BodyTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.ScrollHandlerMixin, {
    templateName: 'body-container',
    classNames: ['table-container', 'body-container'],
    heightBinding: 'controller._bodyHeight',
    widthBinding: 'controller._width',
    scrollTopBinding: 'controller._tableScrollTop',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onScrollTopDidChange: Ember.observer(function() {
      return this.$().scrollTop(this.get('scrollTop'));
    }, 'scrollTop'),
    onScroll: function(event) {
      this.set('scrollTop', event.target.scrollTop);
      return event.preventDefault();
    },
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
        return;
      }
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.FooterTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, {
    templateName: 'footer-container',
    classNames: ['table-container', 'fixed-table-container', 'footer-container'],
    heightBinding: 'controller.footerHeight',
    widthBinding: 'controller._tableContainerWidth',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.ScrollContainer = Ember.View.extend(Ember.StyleBindingsMixin, Ember.ScrollHandlerMixin, {
    templateName: 'scroll-container',
    classNames: ['scroll-container'],
    styleBindings: ['top', 'left', 'width', 'height'],
    widthBinding: 'controller._scrollContainerWidth',
    heightBinding: 'controller._scrollContainerHeight',
    topBinding: 'controller.headerHeight',
    leftBinding: 'controller._fixedColumnsWidth',
    scrollTopBinding: 'controller._tableScrollTop',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onScroll: function(event) {
      this.set('scrollLeft', event.target.scrollLeft);
      return event.preventDefault();
    },
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.ScrollPanel = Ember.View.extend(Ember.StyleBindingsMixin, {
    classNames: ['scroll-panel'],
    styleBindings: ['width', 'height'],
    widthBinding: 'controller._tableColumnsWidth',
    heightBinding: 'controller._tableContentHeight'
  });

}).call(this);
