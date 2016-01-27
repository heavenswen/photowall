;(function(document){	
	var wall =function (arr){
		var $obj = document.getElementById(arr.obj),//父容器
		    $cells = $obj.getElementsByClassName(arr.cell),//图片集
		    $photo = document.getElementById(arr.init)||$obj.getElementsByClassName(arr.init)[0],//作为标准
		    age = arr.age;//行个数
	//1传参检测
		if(!$obj|$cells|!$photo|!age)
		{
			throw new Error("注意:{\"obj\":父容器id,\"cell\":图片容器class，\"photo\":标准图id，\"age\":行个数}");
		}
	//2获得标准图的缩放比	
		//原始宽度
		var init_w = $photo.offsetWidth;
		//设置1宽度
		var cell_w = $obj.offsetWidth/age;
		//缩放比
		var zoom = cell_w/init_w;		
		//设置1的高度
		var cell_h = $photo.offsetHeight*zoom;
		//图片总数
		var size = $cells.length;
		//图片集数组{"obj":obj,'w':w,"h":h}
		var cell_arr = [];
		//位置{"obj":obj,'w':w,"h",'r':r,"v":v}
		var position_arr = [];
		//站位数组
		var table_arr = [];
		//初始行
		var r =0;
		//初始列
		var v = 0;
		//容器高
		var row = 0;
	//3获得图片集的宽高比
	function js_photo(){
		for(var i = 0;i<size;i++)
		{
			var obj = $cells[i],
				width = obj.offsetWidth,
			 	//取整
			 	w = Math.max(parseInt(width*zoom/cell_w),1);	
			 var height = obj.offsetHeight;
			 //获得高度比
			 var h = Math.max(parseInt(height*zoom/cell_h),1);
			 obj.style.position = 'absolute';
			 cell_arr.push({"obj":obj,"w":w,"h":h});
		}
		return position_photo()
	}
	js_photo()
	//4计算图片在容器的位置
		function position_photo(){
			
			for(var i = 0; i < cell_arr.length;i++)
			{
				_max_r()
				var arr = cell_arr[i];
				var q = _query(r,v),
					obj = arr.obj,
					w =arr.w,
					h = arr.h;
				if(q){
						r +=q.w;
						_max_r()
						_query_on(obj,w,h,r,v);	
				}else{
					//不会被遮挡时
					r = _push(obj,w,h,r,v);
				}//if
			}//for
		//添加数组
		function _push(obj,w,h,r,v){
			
			for(var a = 0;a<w;a++)
			{
				//输出位置
				
				if(a == 0){
					position_arr.push({"obj":obj,"w":w,"h":h,"r":r,"v":v});
				}
				//输出站位
				for(var ah = 0;ah<arr.h;ah++)
				{
					table_arr.push({"obj":'',"w":w,"h":h,"r":r,"v":v+ah});
					row = Math.max(row,(v+ah));
					
				};
				r++;
			};
			return r;
		}
		//检测r递增v
		function _max_r(){
			if(r >= age){
				r = 0;
				v++;
			}
		}
		//查询站位图r,当发现无站位时输出
		function _query_on(obj,w,h){
			
			function q(){
				var a = true;
				for(r;a == true ;r++)
				{					
					if(!_query(r,v))
					{
					  _push(obj,w,h,r,v);
					  a = false;
					  break;
					}	
				}
			}
			return q();
		}
		//查询站位图
		function _query(r,v){
			var arr = table_arr;
			function q(){
				for(var i =0;i<arr.length;i++)
				{
					var obj = arr[i],
						td = obj.r,
						tr = obj.v;			
					if(td == r && tr ==v){
						return obj;
					}
				}
			}
			return q();
		}
		return show_photo();
	}	
	//5输出图片
	function show_photo(){
		//原始宽度
		init_w = $photo.offsetWidth;
		//设置1宽度
		cell_w = $obj.offsetWidth/age;
		//缩放比
		zoom = cell_w/init_w;		
		//设置1的高度
		cell_h = $photo.offsetHeight*zoom;
		for(var i = 0;i<position_arr.length;i++){
			var arr = position_arr[i];
			var obj = arr.obj;
			obj.style.top = (arr.v*cell_h)+'px';
			obj.style.left = (arr.r*cell_w)+'px';
			obj.style.height = (arr.h*cell_h)+'px';
			obj.style.width = (arr.w*cell_w)+'px';
		}
		$obj.style.height = (row+1)*cell_h+'px';
	}
	window.addEventListener(resizeEvt, show_photo, false);
	//arr_log(position_arr)
	//arr_log(table_arr)
	function arr_log(arr){
		for(var i = 0;i<arr.length;i++)
		{
			var arrobj = arr[i];
			//console.log(i+"|v:"+arrobj.v+"|r:"+arrobj.r+"|w:"+arrobj.w+"|h:"+arrobj.h)
		}
	}	
}
	//总来的来就是监听当然窗口的变化，一旦有变化就需要重新设置根字体的值
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		window.photo_wall = wall;
	
})(document)
