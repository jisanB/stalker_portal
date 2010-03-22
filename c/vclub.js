/**
 * Video Club modile.
 */

//(function(context){
    
    stb.ajax_loader = 'http://bb2.sandbox/stalker_portal/server/load.php'
    
    /* VCLUB */
    function vclub_constructor(){
            
        this.row_blocks  = ['hd', 'sd', 'fav', 'lock', 'name'];
        
        this.load_params = {
            'type'   : 'vod',
            'action' : 'get_by_name'
        };
        
        this.superclass = Layer.prototype;
        
        this.category_alias = '';
        
        this.sort_menu = {};
        
        this.load_genres = function(alias){
            
            alias = alias || '';
            
            _debug('vclub.load_genres', alias);
        
            stb.load(
                {
                    "type"      : "vod",
                    "action"    : "get_genres_by_category_alias",
                    "cat_alias" : alias
                },
                function(result){
                    _debug('callback categories');
    
                    this.sidebar.fill_items("genre", result);
                },
                this
            )
        };
        
        this.load_years = function(category_id){
            _debug('vclub.load_years');
            
            stb.load(
                {
                    "type"     : "vod",
                    "action"   : "get_years",
                    "category" : category_id
                },
                function(result){
                    _debug('callback years');
    
                    this.sidebar.fill_items("years", result);
                },
                this
            )
        };
        
        this.load_abc = function(){
            _debug('vclub.load_abc');
            
            stb.load(
                {
                    "type"   : "vod",
                    "action" : "get_abc"
                },
                function(result){
                    _debug('callback abc');
                    
                    this.sidebar.fill_items("abc", result);
                },
                this
            )
        };
        
        this.show = function(category){
            
            _debug('vclub.show');
            
            this.load_params['category'] = category.id;
            
            this.superclass.show.apply(this);
            
            try{
                vclub.load_abc();
                vclub.load_genres(category.alias);
                vclub.load_years(category.id);
            }catch(e){
                _debug(e);
            }
        };
        
        this.init_sort_menu = function(map, options){
            this.sort_menu = new bottom_menu(this, options);
            this.sort_menu.init(map);
            this.sort_menu.bind();
        };
        
        this.sort_menu_switcher = function(){
            if (this.sort_menu && this.sort_menu.on){
                this.sort_menu.hide();
            }else{
                this.sort_menu.show();
            }
        };
    }
    
    vclub_constructor.prototype = new Layer();
    
    var vclub = new vclub_constructor();
    
    vclub.bind();
    vclub.init();
    
    vclub.init_left_ear('ears_back');
    vclub.init_right_ear('ears_movie');
    
    vclub.init_color_buttons([
        {"label" : "ОТОБРАЖЕНИЕ", "cmd" : ""},
        {"label" : "СОРТИРОВКА", "cmd" : vclub.sort_menu_switcher},
        {"label" : "ПОИСК", "cmd" : ""},
        {"label" : "ВЫБОРКА", "cmd" : vclub.sidebar_switcher}
    ]);
    
    vclub.init_sidebar();
    
    vclub.sidebar.init_items("abc", {"header" : "ПО БУКВЕ", "width" : 26, "align" : "center"});
    vclub.sidebar.init_items("genre",  {"header" : "ПО ЖАНРУ", "width" : 95});
    vclub.sidebar.init_items("years",  {"header" : "ПО ГОДУ", "width" : 35});
    
    vclub.sidebar.bind();
    
    vclub.init_sort_menu(
        [
            {"label" : "по имени", "cmd" : function(){}},
            {"label" : "по добавлению", "cmd" : function(){}},
            {"label" : "по популярности", "cmd" : function(){}},
            {"label" : "только избранное", "cmd" : function(){}}
        ],
        {
            "offset_x" : 217
        }
    );
   
    vclub.init_header_path('ВИДЕО КЛУБ');
    
    vclub.hide();
    
    module.vclub = vclub;
    /* END VCLUB */
    
    /* Integrate vclub in main menu */
    stb.load(
        {
            "type"   : "vod",
            "action" : "get_categories"
        },
        function(result){
            _debug('callback categories');
            
            var categories = result;
            
            var map = [];
    
            for(var i=0; i<categories.length; i++){
                map.push(
                
                {
                    "title" : categories[i].title,
                    "cmd"   : (function(category){
                        
                        
                        return function(){
                            _debug('alias', category.alias);
                        
                            main_menu.hide();
                            module.vclub.show(category);
                        }
                        
                    })(categories[i]),
                }
                
                );
            }
            
            main_menu.add('ВИДЕОКЛУБ', map);
        },
        this
    )
    
//})()