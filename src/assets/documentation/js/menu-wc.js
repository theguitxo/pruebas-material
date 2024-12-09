'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">pruebas-material documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ArtistAlbumDataComponent.html" data-type="entity-link" >ArtistAlbumDataComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CatDammingsComponent.html" data-type="entity-link" >CatDammingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CatDammingsHistoricChartComponent.html" data-type="entity-link" >CatDammingsHistoricChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CatPopulationComponent.html" data-type="entity-link" >CatPopulationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DataNotFoundComponent.html" data-type="entity-link" >DataNotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DisneyAPIComponent.html" data-type="entity-link" >DisneyAPIComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DrawerMenuComponent.html" data-type="entity-link" >DrawerMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingSpinnerComponent.html" data-type="entity-link" >LoadingSpinnerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalImageViewerComponent.html" data-type="entity-link" >ModalImageViewerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalWrapperComponent.html" data-type="entity-link" >ModalWrapperComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PageTitleComponent.html" data-type="entity-link" >PageTitleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchFilterComponent.html" data-type="entity-link" >SearchFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SimplePaginatorComponent.html" data-type="entity-link" >SimplePaginatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SpotifyAPIComponent.html" data-type="entity-link" >SpotifyAPIComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SpotifySearchFormComponent.html" data-type="entity-link" >SpotifySearchFormComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BreakpointService.html" data-type="entity-link" >BreakpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link" >CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CatDammingsService.html" data-type="entity-link" >CatDammingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CatPopulationService.html" data-type="entity-link" >CatPopulationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomPaginatorIntl.html" data-type="entity-link" >CustomPaginatorIntl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DisneyAPIService.html" data-type="entity-link" >DisneyAPIService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SpotifyAPIService.html" data-type="entity-link" >SpotifyAPIService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AlbumResultItem.html" data-type="entity-link" >AlbumResultItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlbumSearchResponse.html" data-type="entity-link" >AlbumSearchResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlbumSearchResult.html" data-type="entity-link" >AlbumSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArtistResultItem.html" data-type="entity-link" >ArtistResultItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArtistResultItemBase.html" data-type="entity-link" >ArtistResultItemBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArtistSearchResponse.html" data-type="entity-link" >ArtistSearchResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArtistSearchResult.html" data-type="entity-link" >ArtistSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DammingsInfoItem.html" data-type="entity-link" >DammingsInfoItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DammingsInfoResponse.html" data-type="entity-link" >DammingsInfoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilteredInfoItem.html" data-type="entity-link" >FilteredInfoItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilteredInfoItemDate.html" data-type="entity-link" >FilteredInfoItemDate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterForm.html" data-type="entity-link" >FilterForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormatedPopulationData.html" data-type="entity-link" >FormatedPopulationData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageItemInfo.html" data-type="entity-link" >ImageItemInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListItemObject.html" data-type="entity-link" >ListItemObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalImageViewerData.html" data-type="entity-link" >ModalImageViewerData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PopulationDataResponse.html" data-type="entity-link" >PopulationDataResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseCharacter.html" data-type="entity-link" >ResponseCharacter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseCharacterList.html" data-type="entity-link" >ResponseCharacterList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseData.html" data-type="entity-link" >ResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseInfo.html" data-type="entity-link" >ResponseInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultSearchBase.html" data-type="entity-link" >ResultSearchBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchForm.html" data-type="entity-link" >SearchForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchValues.html" data-type="entity-link" >SearchValues</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpotifySearchForm.html" data-type="entity-link" >SpotifySearchForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationItem.html" data-type="entity-link" >StationItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenCheckInfo.html" data-type="entity-link" >TokenCheckInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenInfo.html" data-type="entity-link" >TokenInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenStored.html" data-type="entity-link" >TokenStored</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TypeOption.html" data-type="entity-link" >TypeOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZipCodeItem.html" data-type="entity-link" >ZipCodeItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZipCodeListItem.html" data-type="entity-link" >ZipCodeListItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZipCodesState.html" data-type="entity-link" >ZipCodesState</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/JoinPostalCodesPipe.html" data-type="entity-link" >JoinPostalCodesPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});