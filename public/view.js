var View = function(app){
	var self = this;
	this.controller = app;

	this.cmsListRender = function(data){
		var html = '';
		for(var i=0; i<data.length; i++){
			html += '<li><a href="' + data[i]['id'] + '" class="item" data-page="themeList"><span class="count">';
			html += data[i]['count'] + '</span>' + data[i]['meta_value'] + '</a></li>';	
		}

		$('.cms-list').html(html);
	}

	this.fixAddMetaPageRender = function(){
		$('body').css('margin-top', '-22px');
	}

	this.removeFixesRendering = function(){
		$('body').removeAttr('style');
	}

	this.pageRender = function(page){
		$('.page').css('display', 'none');
		$('#' + page).css('display', 'block');
	}

	this.listingOnSelectRender = function(data, container, selected){
		// debugger;
		var html = '';
		for(var i=0; i<data.length; i++){
			if(typeof data[i]['id'] != 'undefined'){
				html += '<option value="' + data[i]['id'] + '">' + data[i]['meta_value'] + '</option>';
			}else{
				html += '<option value="' + data[i]['meta_value'] + '">' + data[i]['meta_value'] + '</option>';
			}
		}

		// console.log($(container).attr('multiple'));
		// if($(container).attr('multiple') == 'multiple'){
		// 	$(container).prepend('<option value="defalut" disabled selected>Choose your option</option>');
		// }

		$(container).material_select('destroy');
		$('select'+container).html(html);
		$(container).material_select();

		if(typeof selected == 'undefined'){
			// select first element
			$(container).find('li:first-of-type').click();
		}else{
			if(typeof selected == 'string'){
				selected = JSON.parse(selected);
			}

			container = 'div' + container;
			if(typeof selected == 'object'){
				self.setMaterialSelectData(container, selected);
			}else if(typeof selected == "number"){
				$(container).find('option').each(function(i){
					if($(this).attr('value') == selected){
						$(container).find('li:eq(' + i + ')').trigger('click');
						return false;
					}
				});
			}
		}
		
	}

	this.templateListRender = function(data){
		console.log(data);
		
		// clear container
		$('#themeList .cards-container > div').each(function(i){
			if(!$(this).hasClass('card-for-clone')){
				$(this).remove();
			}
		});

		$('.card-for-clone').css('display', 'none');
		for(var i=data['templates'].length - 1; i>=0; i--){
			if(data['thumbs'][i] == null){
				data['thumbs'][i] = {'src': 'images/default-thumbnail.jpg'};
			}
			$('.card-for-clone').clone().appendTo('#themeList .cards-container');
			var card = $('#themeList .cards-container .card:last');
			$(card).find('.card-image img').attr('src', data['thumbs'][i]['src']);
			$(card).find('.c-title').html(data['templates'][i]['name']);
			$(card).find('.description').html(data['templates'][i]['description']);
			$(card).find('a.link-on-demo').attr('href','#themelink=' + data['templates'][i]['link_on_demo']);
			$(card).find('a.upldate-template-btn').attr('href', '#' + data['templates'][i]['id']);
			$(card).parent().removeAttr('style');
			$(card).parent().removeClass('card-for-clone');
		}

		controller.addEventToUpdateBtn();

	}

	this.totalCountCms = function(count){
		$('#themeList .total span').html(count);
	}

	this.preloaderShow = function(container){
		$(container).find('.preloader-container').css('display', 'block');
		$(container).find('.preloader-container').find('.preloader-wrapper').addClass('active');
	}

	this.preloaderHide = function(container){
		$(container).find('.preloader-container').css('display', 'none');
		$(container).find('.preloader-container').find('.preloader-wrapper').removeClass('active');
	}

	this.afterUploadTheme = function(msg){
		self.preloaderHide('#uploadTheme');
		$('#uploadTheme .uploadToServ').css('display', 'block');
		self.notificationOpen({'title': 'Error', 'msg': msg, 'type': 'err'});
		console.log(msg);
	}

	this.beforeUploadTheme = function(){ // call when start upload (after press .uploadToServ)
		self.preloaderShow('#uploadTheme');
		$('#uploadTheme .uploadToServ').css('display', 'none');
	}

	this.demoPageClose = function(){
		$('#demo').css('display', 'none');
		$('body').css('overflow', 'auto');
	}

	this.demoPageRender = function(data){
		$('#demo').css('display', 'block');
		$('body').css('overflow', 'hidden');
		$('.demo-iframe').css('display', 'block');
		// show preloader
		self.preloaderShow($('.demo-iframe').parent());

		$('.demo-iframe').attr('src', data['template']['link_on_demo']);
		$('.demo-iframe').on('load', function(){
			$(this).css('display', 'block');
			//hide preloader
			self.preloaderHide($('.demo-iframe').parent());
		});

		// self.fixIframe();

		// render other parts demo page
		var cont = $('.demo-info');
		cont.find('.title').html(data.template.name);
		cont.find('.description').html(data.template.description);
		var html = '';
		for(var i=0; i<data.thumbs.length; i++){
			html += '<img class="thumb" src="' + data.thumbs[i].src + '">';
		}
		cont.find('.thumbs-container').html(html);
	}

	this.bigPreloaderShow = function(){
		$('.big-preloader').css('display', 'block');
		self.preloaderShow('.big-preloader');
	}

	this.bigPreloaderHide = function(){
		$('.big-preloader').css('display', 'none');
		self.preloaderHide('.big-preloader');
	}

	/**
	 * [open notification window]
	 * @param  {[object]} data [object like {title: 'some title', msg: 'some text', type: 'err or normal'}]
	 */
	this.notificationOpen = function(data){
		var cont = $('.notification-container');
		cont.find('.card-title').html(data.title);
		cont.find('p').html(data.msg);
		if(typeof data.type != 'undefined' && data.type == 'err'){
			cont.find('.card').addClass('red').removeClass('green');
		}else{
			cont.find('.card').removeClass('red').addClass('green');
		}
		cont.css('display', 'block');
	}

	this.notificationClose = function(callback){
		$('.notification-container').css({
			display: 'none'
		});

		if(typeof callback == 'function'){
			callback();
		}
	}

	this.activeOrderLink = function(lastOrder){
		$('[data-order]').removeClass('orange-text');
		$('[data-order="' + lastOrder + '"]').addClass('orange-text');
	}

	this.validLinkOnDemo = function(){
		var lod = $('#link_on_demo');
		lod.addClass('valid').removeClass('invalid');
		$('.uploadToServ').removeClass('disabled');
		$('.updateDataOnServ').removeClass('disabled');
	}	

	this.invalidLinkOnDemo = function(){
		var lod = $('#link_on_demo');
		lod.removeClass('valid').addClass('invalid');
		$('.uploadToServ').addClass('disabled');
		$('.updateDataOnServ').addClass('disabled');
	}	

	this.openMenu = function(){
		$('aside').addClass('menu-opened');
    	$('.page').css('overflow', 'hidden');
    	$('.page').css('height', '100px');
	}

	this.closeMenu = function(){
		$('aside').removeClass('menu-opened');
    	$('.page').removeAttr('style');
	}

	this.resultMessageShow = function(txt){
		$('.result-message-container').html(txt);
		$('.result-message-container').css('display', 'block');
	}

	this.resultMessageHide = function(){
		$('.result-message-container').css('display', 'none');
	}

	this.fixIframe = function(){
		var iframe = document.getElementById('demo-iframe')[0];
		var url = iframe.src;
		var getData = function (data) {
		    if (data && data.query && data.query.results && data.query.results.resources && data.query.results.resources.content && data.query.results.resources.status == 200) loadHTML(data.query.results.resources.content);
		    else if (data && data.error && data.error.description) loadHTML(data.error.description);
		    else loadHTML('Error: Cannot load ' + url);
		};
		var loadURL = function (src) {
		    url = src;
		    var script = document.createElement('script');
		    script.src = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData';
		    document.body.appendChild(script);
		};
		var loadHTML = function (html) {
		    iframe.src = 'about:blank';
		    iframe.contentWindow.document.open();
		    iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + url + '"><scr' + 'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); parent.loadURL(e.target.href); } });</scr' + 'ipt>'));
		    iframe.contentWindow.document.close();
		}

		loadURL(iframe.src);
	}

	this.clearAllSelect = function(){
		var selects = $('#addMeta select');
		for(var i in selects){
			var materialSelectId = $(selects[i]).attr('data-select-id');
			$('#'+materialSelectId+' li', 0).removeClass('active');
		}
	}

	this.setDataToFormUpdate = function(template, keys, thumbnails){
		$('#template_name').val(template.name).parent().find('label').addClass('active');;
		$('#description').val(template.description).html(template.description).parent().find('label').addClass('active');

		for(var i in keys){
			keys[i]['tag'] = keys[i]['key_name'];
		}

		$('[name="link_on_demo"]').val(template['link_on_demo']).parent().find('label').addClass('active');

		for(var i in thumbnails){
			var img = new Image();
			img.src = thumbnails[i].src;
			THUMBNAILS.push(thumbnails[i].src);
			$(img).addClass('thumbnail-item');
			var countThumbs = $('.thumbnail-container .thumbnail-item').length;
			$(img).attr('data-index', countThumbs);
			addThumbnail(img);
		}

		setTimeout(function(){
			self.preloaderHide('#addMeta');
			self.clearAllSelect();
			// self.setMaterialSelectData('compatible-browsers', JSON.parse(template.meta_browsers));

			$('.keywords-container').material_chip({
				data: keys,
			    placeholder: 'Enter a tag',
			    secondaryPlaceholder: '+Tag'
			   });
		}, 3000);
	}

	var arr = [];
	arr.push({x: 1, y: 2});
	arr[0].y

	this.setMaterialSelectData = function(container, arr){
		// debugger;
		var options = $(container).find('select option');
		var inx = [];
		for(var i in arr){
			for(var n in options){
				if(arr[i] == $(options[n]).attr('value')){
					inx.push(n);
				}
			}
		}

		for(var i in inx){
			$(container).find('li:eq(' + inx[i] + ')').trigger('click');
		}
	}

	this.clearFieldsOnAddMetaPage = function(){
		$('[name="template_name"]').val('').parent().find('label').removeClass('active');
		$('[name="link_on_demo"]').val('').parent().find('label').removeClass('active');
		$('[name="description"]').val('').html('').parent().find('label').removeClass('active');
		self.clearThumbnails();
		self.controller.initKeywords();
	}

	this.clearThumbnails = function(){
		$('.thumbnail-container .thumb-wrap').each(function(){
			$(this).find('.remove-uploaded-img').trigger('click');
		});
	}
}