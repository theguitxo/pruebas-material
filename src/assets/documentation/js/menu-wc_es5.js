'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _callSuper(this, _class);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _inherits(_class, _HTMLElement);
  return _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">pruebas-material documentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#components-links"' : 'data-bs-target="#xs-components-links"', ">\n                            <span class=\"icon ion-md-cog\"></span>\n                            <span>Components</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="components-links"' : 'id="xs-components-links"', ">\n                            <li class=\"link\">\n                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" >AppComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ArtistAlbumDataComponent.html\" data-type=\"entity-link\" >ArtistAlbumDataComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/CatDammingsComponent.html\" data-type=\"entity-link\" >CatDammingsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/CatDammingsHistoricChartComponent.html\" data-type=\"entity-link\" >CatDammingsHistoricChartComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/CatPopulationComponent.html\" data-type=\"entity-link\" >CatPopulationComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/DataNotFoundComponent.html\" data-type=\"entity-link\" >DataNotFoundComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/DisneyAPIComponent.html\" data-type=\"entity-link\" >DisneyAPIComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/DrawerMenuComponent.html\" data-type=\"entity-link\" >DrawerMenuComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/HomeComponent.html\" data-type=\"entity-link\" >HomeComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LoadingSpinnerComponent.html\" data-type=\"entity-link\" >LoadingSpinnerComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ModalImageViewerComponent.html\" data-type=\"entity-link\" >ModalImageViewerComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ModalWrapperComponent.html\" data-type=\"entity-link\" >ModalWrapperComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/PageTitleComponent.html\" data-type=\"entity-link\" >PageTitleComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SearchFilterComponent.html\" data-type=\"entity-link\" >SearchFilterComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SimplePaginatorComponent.html\" data-type=\"entity-link\" >SimplePaginatorComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SpotifyAPIComponent.html\" data-type=\"entity-link\" >SpotifyAPIComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SpotifySearchFormComponent.html\" data-type=\"entity-link\" >SpotifySearchFormComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#injectables-links"' : 'data-bs-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/BreakpointService.html\" data-type=\"entity-link\" >BreakpointService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CacheService.html\" data-type=\"entity-link\" >CacheService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CatDammingsService.html\" data-type=\"entity-link\" >CatDammingsService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CatPopulationService.html\" data-type=\"entity-link\" >CatPopulationService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CustomPaginatorIntl.html\" data-type=\"entity-link\" >CustomPaginatorIntl</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/DisneyAPIService.html\" data-type=\"entity-link\" >DisneyAPIService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/LoadingService.html\" data-type=\"entity-link\" >LoadingService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/SpotifyAPIService.html\" data-type=\"entity-link\" >SpotifyAPIService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#interfaces-links"' : 'data-bs-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/AlbumResultItem.html\" data-type=\"entity-link\" >AlbumResultItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AlbumSearchResponse.html\" data-type=\"entity-link\" >AlbumSearchResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AlbumSearchResult.html\" data-type=\"entity-link\" >AlbumSearchResult</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ArtistResultItem.html\" data-type=\"entity-link\" >ArtistResultItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ArtistResultItemBase.html\" data-type=\"entity-link\" >ArtistResultItemBase</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ArtistSearchResponse.html\" data-type=\"entity-link\" >ArtistSearchResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ArtistSearchResult.html\" data-type=\"entity-link\" >ArtistSearchResult</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/DammingsInfoItem.html\" data-type=\"entity-link\" >DammingsInfoItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/DammingsInfoResponse.html\" data-type=\"entity-link\" >DammingsInfoResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FilteredInfoItem.html\" data-type=\"entity-link\" >FilteredInfoItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FilteredInfoItemDate.html\" data-type=\"entity-link\" >FilteredInfoItemDate</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FilterForm.html\" data-type=\"entity-link\" >FilterForm</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FormatedPopulationData.html\" data-type=\"entity-link\" >FormatedPopulationData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ImageItemInfo.html\" data-type=\"entity-link\" >ImageItemInfo</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ListItemObject.html\" data-type=\"entity-link\" >ListItemObject</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/MenuItem.html\" data-type=\"entity-link\" >MenuItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ModalImageViewerData.html\" data-type=\"entity-link\" >ModalImageViewerData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/PopulationDataResponse.html\" data-type=\"entity-link\" >PopulationDataResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ResponseCharacter.html\" data-type=\"entity-link\" >ResponseCharacter</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ResponseCharacterList.html\" data-type=\"entity-link\" >ResponseCharacterList</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ResponseData.html\" data-type=\"entity-link\" >ResponseData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ResponseInfo.html\" data-type=\"entity-link\" >ResponseInfo</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ResultSearchBase.html\" data-type=\"entity-link\" >ResultSearchBase</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SearchForm.html\" data-type=\"entity-link\" >SearchForm</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SearchValues.html\" data-type=\"entity-link\" >SearchValues</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SpotifySearchForm.html\" data-type=\"entity-link\" >SpotifySearchForm</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/StationItem.html\" data-type=\"entity-link\" >StationItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/TokenCheckInfo.html\" data-type=\"entity-link\" >TokenCheckInfo</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/TokenInfo.html\" data-type=\"entity-link\" >TokenInfo</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/TokenStored.html\" data-type=\"entity-link\" >TokenStored</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/TypeOption.html\" data-type=\"entity-link\" >TypeOption</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ZipCodeItem.html\" data-type=\"entity-link\" >ZipCodeItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ZipCodeListItem.html\" data-type=\"entity-link\" >ZipCodeListItem</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ZipCodesState.html\" data-type=\"entity-link\" >ZipCodesState</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#pipes-links"' : 'data-bs-target="#xs-pipes-links"', ">\n                                <span class=\"icon ion-md-add\"></span>\n                                <span>Pipes</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"pipes/JoinPostalCodesPipe.html\" data-type=\"entity-link\" >JoinPostalCodesPipe</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#miscellaneous-links"' : 'data-bs-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/enumerations.html\" data-type=\"entity-link\">Enums</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\" rel=\"noopener noreferrer\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)));