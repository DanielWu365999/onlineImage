/**
 * Date: 18-04-04
 * Time: 下午16:34
 * 在线图片选取搜索（单选一张）对话框逻辑代码
 */

$(function(){
	onlinepic = function(autoClose){
		if(autoClose) {
			this.autoClose = autoClose;
		}else{
			this.autoClose = true;
		}
		this.init();
	};
    onlinepic.prototype = {
    	container : $('<div id="onlinepic" class="onlinepic"></div>'),
    	init: function(){
    		this.reset();
    	},
        html: function(){
            var _this = this;
            
            return this.container.prop("outerHTML");
        },
        initContainer: function () {
            var _this = this;
        	this.container.html('');
			this.start = '<div class="searchBar">\
                    <input id="searchText" class="searchText text" type="text" placeholder="请输入搜索关键词">\
                    <input id="searchButton" type="button" value="搜索">\
                </div>\
                <div id="imageList">\
                	<ul class="list">\
                	</ul>\
               </div>';
            this.container.append(this.start);
        },
        /* 初始化滚动事件,滚动到底步自动拉取数据 */
        initEvents: function () {
            var _this = this;
            /* 滚动拉取图片 */
            $("#onlinepic #imageList").scroll(function(){
                var panel = this;
                if(_this.isLoadingData){
                    return
                }
                if (panel.scrollHeight - (panel.offsetHeight + panel.scrollTop) < 10) {
                     if(_this.pageNum > _this.pages){
                         _this.isLoadingData = true;
                         return
                     }
                     _this.pageNum = _this.pageNum + 1;
                     console.log(_this.pageNum);
                    if(_this.pageNum < _this.pages){
                        _this.getImageData();
                    }
                }
            });
            /* 搜索图片  */
            $('body').delegate('#searchButton','click',function(){
                var keyword = $('#searchText').val();
                _this.keyword = keyword;
                $('#onlinepic #imageList ul').html('');
                _this.reset();
                _this.pageNum = 1;
            });
            /* 选中图片 */
            $('body').delegate('ul.list li','click',function(){
				$(this).addClass('selected').siblings().removeClass('selected');
			});
        },
        /* 初始化第一次的数据 */
        initData: function () {
            /* 拉取数据需要使用的值 */
            this.pageSize = 15;
            this.pageNum = 1;
            this.pages = 1;
            this.keyword = $('#searchText').val();
            /* 第一次拉取数据 */
            this.getImageData();
        },
        /* 重置界面 */
        reset: function() {
            this.initContainer();
            this.initData();
        },
        /* 向后台拉取图片列表数据 */
        getImageData: function () {
            var _this = this;
            if(_this.pageNum > _this.pages){
                return;
            }
	    	_this.isLoadingData = true;
	        $.ajax({
				url:BASE_URL+'/cmsPicLib/getPicLib',
				data: {
	                pageNum: this.pageNum,
	                pageSize: this.pageSize,
	                keyword: this.keyword
	            },
				type:'get',
				success:function(data){
					if(data.status == 200){
						_this.pushData(data.list);
						_this.pages = data.pages;
						_this.isLoadingData = false;
					}else {
						layer.msg(data.msg,{icon:5,shadeClose:true,shade:0.5,time:1500});
					}
				},
				error : function() {
					layer.msg("系统错误",{icon:5,shadeClose:true,shade:0.5,time:1500});
				}
			});              
        },
        /* 添加图片到列表界面上 */
        pushData: function (list) {
            var _this = this;
            var html ='';
            var tpl =  '<li><img width="113" src="{url}" id="{id}"><span class="icon"></span><div class="filename">{name}</div></li>';
         	$.each(list,function(n,value){
			 	html += tpl.replace('{id}',value.id)
			 			.replace('{url}',BASE_URL + value.imgPath)
			 	   		.replace('{name}',value.picName);
			});
			$('#imageList').find(".list").append(html);
        },
        popContainer: function(callback){
        	var _this=this;
        	//alert(this.html());
        	//console.log(this);
        	
            layer.open({
                type: 1,
                title: '在线图库',
                shadeClose: true,
                shade: 0.5,
                scrollbar: false,
                area: ['520px', '336px'], //宽高
                btn: ['确定','取消'],
                content: this.html(),
                yes:function(index,layero){
                	_this.currenIndex=index;
                    if(callback){callback()};
                    if(_this.autoClose){
                    	layer.close(index)}
                	},
                end:function(){
                }
            });
            this.initEvents();
        },
        close:function(){
        	layer.close(this.currenIndex);
        }
    };
    window.onlinepic = onlinepic;
})
