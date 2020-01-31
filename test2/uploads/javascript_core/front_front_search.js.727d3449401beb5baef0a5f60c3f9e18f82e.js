;(function($,_,undefined){"use strict";ips.controller.register('core.front.search.filters',{initialize:function(){this.on('click','[data-action="showFilters"]',this.showFilters);this.on('click','[data-action="searchByTags"]',this.toggleSearchFields);this.on('click','[data-action="searchByAuthors"]',this.toggleSearchFields);this.on('click','[data-action="cancelFilters"]',this.cancelFilters);this.on('change','input[name="type"]',this.toggleFilterByCounts);this.on('itemClicked.sideMenu','[data-filterType="dateCreated"]',this.filterDate);this.on('itemClicked.sideMenu','[data-filterType="dateUpdated"]',this.filterDate);this.on('itemClicked.sideMenu','[data-filterType="joinedDate"]',this.filterDate);this.on('change','[name^="search_min_"]',this.changeValue);this.on('tokenDeleted tokenAdded',this.tokenChanged);this.on('resultsLoading.search',this.resultsLoading);this.on('resultsDone.search',this.resultsDone);this.on('cancelResults.search',this.cancelResults);this.on('submit',this.submitForm);this.on('tabShown',this.tabShown);this.on('nodeInitialValues',this.setup);if(!this.scope.find('[data-role="hints"] ul li').length){this.scope.find('[data-role="hints"]').hide();}
this.setup();},setup:function(){var data=this.scope.find('form').serializeArray();this.trigger('initialData.search',{data:data});this.toggleFilterByCounts();},toggleFilterByCounts:function(){var type=this.scope.find('input[name="type"]:checked').val();if(!type){$('#elSearch_filter_by_number').hide();}else{$('#elSearch_filter_by_number').show();}},cancelResults:function(){this.showFilters();this.scope.find('[data-role="hints"]').remove();this.scope.find('#elMainSearchInput').val('').focus();this.scope.find('[data-action="cancelFilters"], [data-action="searchAgain"]').hide();},changeValue:function(e){var field=$(e.currentTarget);var name=field.attr('name');var bubble=this.scope.find('[data-role="'+name+'_link"] [data-role="fieldCount"]');if(field.val()==0){bubble.text('0').addClass('ipsHide');}else{bubble.text(field.val()).removeClass('ipsHide');}},tokenChanged:function(e,data){var tags=this.scope.find('input[name="tags"]');var term=this.scope.find('input[name="q"]');var andOr=this.scope.find('[data-role="searchTermsOrTags"]');if(tags.val()&&term.val()&&!andOr.is(':visible')){andOr.slideDown();}else if((!tags.val()||!term.val())&&andOr.is(':visible')){andOr.slideUp();}},tabShown:function(e,data){if(data.tabID=='elTab_searchMembers'){this.scope.find('input[name="type"][value="core_members"]').prop('checked',true).change().end().find('[data-action="updateResults"]').text(ips.getString('searchMembers'));}else{this.scope.find('[data-role="searchApp"] .ipsSideMenu_itemActive input[type="radio"]').prop('checked',true).change().end().find('[data-action="updateResults"]').text(ips.getString("searchContent"));}},cancelFilters:function(e){var self=this;this.scope.find('[data-role="searchFilters"]').slideUp('fast',function(){self.scope.find('[data-action="showFilters"]').slideDown();});},showFilters:function(e){if(e){e.preventDefault();}
this.scope.find('[data-action="showFilters"]').hide();this.scope.find('[data-role="searchFilters"]').slideDown();$(document).trigger('contentChange',[this.scope]);},resultsDone:function(e,data){var searchButton=this.scope.find('[data-action="updateResults"]');searchButton.prop('disabled',false).text(searchButton.attr('data-originalText'));this.scope.find('[data-role="searchFilters"]').hide();this.scope.find('[data-action="showFilters"]').removeClass('ipsHide').show();this.scope.find('[data-action="searchAgain"]').removeClass('ipsHide ipsButton_disabled').show();if(!_.isUndefined(data.hints)){this.scope.find('[data-role="hints"]').html(data.hints).show();}
if(!this.scope.find('[data-role="hints"] ul li').length){this.scope.find('[data-role="hints"]').hide();}
$(document).trigger('contentChange',[this.scope]);},resultsLoading:function(e,data){var searchButton=this.scope.find('[data-action="updateResults"]');this.scope.find('[data-action="searchAgain"]').addClass('ipsButton_disabled');searchButton.prop('disabled',true).attr('data-originalText',searchButton.text()).text(ips.getString("searchFetchingResults"));},toggleSearchFields:function(e){e.preventDefault();var link=$(e.currentTarget);var opens=link.attr('data-opens').split(',');var i;for(i=0;i<opens.length;i++){this.scope.find('[data-role="'+opens[i]+'"]').slideDown(function(){if(!link.closest('ul').find('li').length){link.closest('ul').remove();}
$(this).find('input[type="text"]').focus();});}
link.closest('li').hide();},filterDate:function(e,data){var elem=$(e.currentTarget);if(data.selectedItemID=='custom'){elem.find('[data-role="dateForm"]').slideDown();}else{elem.find('[data-role="dateForm"]').slideUp();}},submitForm:function(e){e.preventDefault();this.scope.find('#elMainSearchInput').blur();var self=this;var app=this.scope.find('[data-role="searchApp"] .ipsSideMenu_itemActive');var appKey=app.attr('data-ipsMenuValue');var appTitle=app.find('[data-role="searchAppTitle"]').text();var isMemberSearch=$('#elTab_searchMembers').hasClass('ipsTabs_activeItem');var searchTerm=$.trim(this.scope.find('#elMainSearchInput').val());var tagExists=(this.scope.find('#elInput_tags').length&&this.scope.find('#elTab_searchContent').hasClass('ipsTabs_activeItem'));if(tagExists){var tagField=ips.ui.autocomplete.getObj(this.scope.find('#elInput_tags'));var tokens=tagField.getTokens();}
if(!isMemberSearch){if(!searchTerm&&!tagExists||!searchTerm&&tagExists&&tokens.length===0){ips.ui.alert.show({type:'alert',message:(!searchTerm&&!tagExists)?ips.getString('searchRequiresTerm'):ips.getString('searchRequiresTermTags'),icon:'info',callbacks:{ok:function(){setTimeout(function(){self.scope.find('#elMainSearchInput').focus();},300);}}});return;}}
this.trigger('formSubmitted.search',{data:this.scope.find('form').serializeArray(),appKey:appKey,tabType:this.scope.closest('data-tabType').attr('data-tabType'),appTitle:appTitle});}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('core.front.search.main',{_content:null,_formData:{},_loadingDiv:null,_initialURL:'',_initialData:{},initialize:function(){this.on('initialData.search',this.initialData);this.on('formSubmitted.search',this.submittedSearch);this.on('paginationClicked paginationJump',this.paginationClicked);History.Adapter.bind(window,'statechange',_.bind(this.stateChange,this));this.setup();},setup:function(){this._content=this.scope.find('#elSearch_main');this._baseURL=this.scope.attr('data-baseURL');if(this._baseURL.match(/\?/)){this._baseURL+='&';}else{this._baseURL+='?';}
if(this._baseURL.slice(-1)=='&'){this._baseURL=this._baseURL.slice(0,-1)}
this._initialURL=window.location.href;},initialData:function(e,data){this._formData=this._getFormData(data.data);this._initialData=_.clone(this._formData);},stateChange:function(){var state=History.getState();if((!state.data.controller||state.data.controller!='core.front.search.main')&&this._initialURL!==state.url){return;}
if(this._initialURL==state.url&&!_.isUndefined(state.data)&&!_.size(state.data)){this._cancelSearch();}else if(this._initialURL==state.url&&_.isUndefined(state.data.url)){this._loadResults(this._getUrlFromData(this._initialData));}else{this._loadResults(state.data.url);}},submittedSearch:function(e,data){this._formData=this._getFormData(data.data);var url=this._getUrlFromData(this._formData);History.pushState({controller:'core.front.search.main',url:url,filterData:this._formData},this._getBrowserTitle(),url);},_cancelSearch:function(){var results=this.scope.find('[data-role="filterContent"]');var blurb=this.scope.find('[data-role="searchBlurb"]');ips.controller.cleanContentsOf(results);this.triggerOn('core.front.search.filters','cancelResults.search');results.html('');blurb.html('').hide();},_getUrlFromData:function(data){var params=[];_.each(['q','type','page'],function(val){if(!_.isUndefined(data[val])&&data[val]!==''){params.push(val+'='+encodeURIComponent(data[val]));}});if(data['type']=='core_members'){if(!_.isUndefined(data['joinedDate'])){if(data['joinedDate']!=='custom'){params.push('joinedDate='+data['joinedDate']);}else{if(!_.isUndefined(data['joinedDateCustom[start]'])){params.push('start_after='+encodeURIComponent(new Date(data['joinedDateCustom[start]']).getTime()/ 1000));}
if(!_.isUndefined(data['joinedDateCustom[end]'])){params.push('start_before='+encodeURIComponent(new Date(data['joinedDateCustom[end]']).getTime()/ 1000));}}}
if(!_.isUndefined(data['group'])){if(!_.isArray(data['group'])){data['group']=[data['group']];}
for(var i=0;i<data['group'].length;i++){params.push('group['+data['group'][i]+']=1');}}
_.each(data,function(val,key){if(!key.startsWith('core_pfield')||val===0||val===''){return;}
params.push(key+'='+val);});}else{_.each(['item','author','search_min_replies','search_min_views','search_min_comments','search_min_reviews'],function(val){if(!_.isUndefined(data[val])&&data[val]!==''&&parseInt(data[val])!==0){if(val==='author'){data[val]=encodeURIComponent(data[val]);}
params.push(val+'='+data[val]);}});if(!_.isUndefined(data['tags'])){params.push('tags='+data['tags'].replace(/\n/g,','));}
if(!_.isUndefined(data[data['type']+'_node'])){params.push('nodes='+data[data['type']+'_node']);}
if(!_.isUndefined(data['club[]'])){if(_.isArray(data['club[]'])){params.push('club='+data['club[]'].filter(function(v){return v!='__EMPTY';}));}else if(data['club[]'].replace('__EMPTY','')){params.push('club='+data['club[]'].replace('__EMPTY',''));}}
if(!_.isUndefined(data['eitherTermsOrTags'])){if($.trim(data['q'])!==''&&$.trim(data['tags'])!==''){params.push('eitherTermsOrTags='+data['eitherTermsOrTags']);}}
if(!_.isUndefined(data['search_and_or'])&&(data['search_and_or']=='or'||data['search_and_or']=='and')){params.push('search_and_or='+data['search_and_or']);}
if(!_.isUndefined(data['search_in'])&&data['search_in']=='titles'){params.push('search_in='+data['search_in']);}
var datesSet={startDate:false,updatedDate:false};_.each([['startDate','start_after'],['updatedDate','updated_after']],function(val){if(!_.isUndefined(data[val[0]])){if(data[val[0]]!=='any'&&data[val[0]]!=='custom'){params.push(val[1]+'='+data[val[0]]);datesSet[val[0]]=true;}else if(data[val[0]]==='any'){datesSet[val[0]]=true;}}});_.each([['startDateCustom[start]','start_after'],['startDateCustom[end]','start_before'],['updatedDateCustom[start]','updated_after'],['updatedDateCustom[end]','updated_before']],function(val){var thisType=(val[0].indexOf('startDate')!=-1)?'startDate':'updatedDate';if(!_.isUndefined(data[val[0]])&&!datesSet[thisType]){if((val[0]=='startDateCustom[start]'||val[0]=='startDateCustom[end]')&&!_.isUndefined(data['startDate'])&&data['startDate']=='any'){}else if((val[0]=='updatedDateCustom[start]'||val[0]=='updatedDateCustom[end]')&&!_.isUndefined(data['updatedDate'])&&data['updatedDate']=='any'){}else{params.push(val[1]+'='+encodeURIComponent(ips.utils.time.getDateFromInput($('[name="'+val[0]+'"]')).getTime()/ 1000));}}});}
if(!_.isUndefined(data['sortby'])){params.push('sortby='+data['sortby']);}
if(!_.isUndefined(data['sortdirection'])){params.push('sortdirection='+data['sortdirection']);}
return this._baseURL+'&'+params.join('&');},_loadResults:function(url){var self=this;this.triggerOn('core.front.search.filters','resultsLoading.search');this._setContentLoading(true);ips.getAjax()(url).done(function(response){if(typeof response!=='object'){window.location=url;}
if(response.css){self._addCSS(response.css);}
self.triggerOn('core.front.search.filters','resultsDone.search',{contents:response.filters,hints:response.hints});self._content.html(response.content);$(document).trigger('contentChange',[self._content]);self.scope.find('[data-role="searchBlurb"]').show().html(response.title);self.scope.find('[data-action="cancelFilters"]').show();var newItems=self.scope.find('[data-role="resultsArea"] [data-role="activityItem"]').css({opacity:0});var delay=100;newItems.slideDown(function(){newItems.each(function(index){var d=(index*delay);$(this).delay((d>1200)?1200:d).animate({opacity:1});});});}).fail(function(jqXHR,textStatus){window.location=url;}).always(function(){self._setContentLoading(false);});},paginationClicked:function(e,data){if(data.originalEvent){data.originalEvent.preventDefault();}
this._formData['page']=data.pageNo;var url=this._getUrlFromData(this._formData);History.pushState({controller:'core.front.search.main',url:url},document.title,url);var elemPosition=ips.utils.position.getElemPosition(this.scope);$('html, body').animate({scrollTop:elemPosition.absPos.top+'px'});},_getFormData:function(data){if(!_.isObject(data)){return;}
var returnData={};var skipData=['page','csrfKey'];for(var i=0;i<data.length;i++){if(_.indexOf(skipData,data[i].name)===-1&&data[i].value!==''){if(!_.isUndefined(returnData[data[i].name])&&!_.isArray(returnData[data[i].name])){var tmp=returnData[data[i].name];returnData[data[i].name]=[];returnData[data[i].name].push(tmp);}
if(!_.isUndefined(returnData[data[i].name])){returnData[data[i].name].push(data[i].value);}else{returnData[data[i].name]=data[i].value;}
if(data[i].name!='club[]'){if($('#'+data[i].name+'-unlimitedCheck').length){if(!$('#'+data[i].name+'-unlimitedCheck:checked').length){returnData[data[i].name]=$('input[type=number][name='+data[i].name+']').val();}
else{delete(returnData[data[i].name]);}}}}}
if(!_.isUndefined(data['type'])&&data['type']!='core_members'){if(!_.isUndefined(data['sortby'])){delete(data['sortby']);}
if(!_.isUndefined(data['sortdirection'])){delete(data['sortdirection']);}}
return returnData;},_getBrowserTitle:function(){var title=ips.getString('searchTitle');var currentType=this.scope.find('input[type="radio"][name="type"]:checked');var q=this._formData['q'];if(_.isUndefined(q)){q='';}
if(q!==''&&!currentType.length){title=ips.getString('searchTitleTerm',{term:q});}else if(q!==''&&currentType.length){title=ips.getString('searchTitleTermType',{term:q,type:currentType.next('[data-role="searchAppTitle"]').text()});}else if(q===''&&this._currentType!==''){title=ips.getString('searchTitleType',{type:currentType.next('[data-role="searchAppTitle"]').text()});}
return title;},_addCSS:function(css){var head=$('head');if(css&&css.length){for(var i=0;i<css.length;i++){head.append($('<link/>').attr('href',css[i]).attr('type','text/css').attr('rel','stylesheet'));}}},_setContentLoading:function(state){var results=this.scope.find('[data-role="resultsContents"]');if(!results.length){if(this._loadingDiv){this._loadingDiv.hide();}
return;}
var dims=ips.utils.position.getElemDims(results);var position=ips.utils.position.getElemPosition(results);if(!this._loadingDiv){this._loadingDiv=$('<div/>').append($('<div/>').css({height:_.min([200,results.outerHeight()])+'px'}).addClass('ipsLoading'));ips.getContainer().append(this._loadingDiv);}
this._loadingDiv.show().css({left:position.viewportOffset.left+'px',top:position.viewportOffset.top+$(document).scrollTop()+'px',width:dims.width+'px',height:dims.height+'px',position:'absolute',zIndex:ips.ui.zIndex()})
if(state){results.animate({opacity:0.6}).css({height:results.height()+'px'});}else{results.css({height:'auto',opacity:1});this._loadingDiv.hide();}}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('core.front.search.results',{_resultLength:300,_terms:[],initialize:function(){this.setup();this.on(document,'contentChange',_.bind(this.contentChange,this));},setup:function(){jQuery.expr[':'].icontains=function(a,i,m){return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;};var self=this;try{this._terms=JSON.parse(this.scope.attr('data-term'));}catch(err){Debug.log("Error parsing search terms");return;}
this.scope.find('[data-role="activityItem"]').each(function(){self._processResult($(this));});},contentChange:function(){var self=this;this.scope.find('[data-role="activityItem"]').each(function(){self._processResult($(this));});},_processResult:function(result){if(result.attr('data-processed')){return;}
var findWords=result.find('[data-findTerm]');if(findWords.length){this._findWords(findWords);}
this._highlight(result);result.attr('data-processed',true);},_findWords:function(result){var text=$.trim(result.text());var firstMatch=text.length;var startPoint=0;var foundMatches=false;for(var i=0;i<this._terms.length;i++){var indexOf=text.search(new RegExp(ips.utils.escapeRegexp(this._terms[i]),'i'));if(indexOf!==-1){foundMatches=true;if(indexOf<firstMatch){firstMatch=indexOf;}}}
var punctuationMarks=['.',',','?','!'];var searchBack=(firstMatch-(this._resultLength / 2)<0)?0:firstMatch-(this._resultLength / 2);if(!foundMatches){startPoint=0;}else{for(var j=firstMatch;j>searchBack;j--){if(punctuationMarks.indexOf(text[j])!==-1){startPoint=j+1;break;}}}
var finalSnippet=$.trim(text.substring(startPoint,startPoint+300));if(startPoint>0&&foundMatches){finalSnippet='...'+finalSnippet;}
if(startPoint+this._resultLength<text.length||(!foundMatches&&text.length>this._resultLength)){finalSnippet=finalSnippet+'...';}
result.text(finalSnippet);},_highlight:function(result){var self=this;var elements=result.find('[data-searchable]');_.each(this._terms,function(term,index){elements.each(function(){if(!$(this).is(':icontains("'+term+'")')){return;}
$(this).contents().filter(function(){return this.nodeType===3}).each(function(){$(this).replaceWith(_.escape(XRegExp.replace($(this).text(),new RegExp("(\\b|\\s|^)("+term+"\\w*)(\\b|\\s|$)","ig"),'<mark class="ipsMatch'+(index+1)+'">'+"$2 "+'</mark>')).replace(new RegExp("&lt;mark class=&quot;ipsMatch"+(index+1)+"&quot;&gt;",'ig'),"<mark class='ipsMatch"+(index+1)+"'>").replace(new RegExp("&lt;/mark&gt;",'ig'),"</mark>"));});});});}});}(jQuery,_));;