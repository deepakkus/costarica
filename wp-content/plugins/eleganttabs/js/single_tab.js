(function ($) {
	/* js view for singleTab Element*/
  
//console && console.log('EtSubTabView.js is loaded');
// Come from vc_map -> 'js_view' => 'EtSubTabView'
if(typeof vc === 'undefined' || typeof window.VcColumnView==='undefined')
            return false;
var Shortcodes = vc.shortcodes;

window.EtSubTabView = window.VcColumnView.extend({
    	 events:{
          'click > .vc_controls .vc_control-btn-delete':'deleteShortcode',
          'click > .vc_controls .vc_control-btn-prepend':'addElement',
          'click > .vc_controls .vc_control-btn-edit':'editElement',
          'click > .vc_controls .vc_control-btn-clone':'clone',
          'click > .wpb_element_wrapper > .vc_empty-container':'addToEmpty'
        },
	
	// Render method called after element is added( cloned ), and on first initialisation
    render:function () {
            var params = this.model.get('params');
            // console && console.log('EtSubTabView.params:'+params);
            window.EtSubTabView.__super__.render.call(this);
           // console && console.log('EtSubTabView.render() is loaded');
            if(!params.tab_id) {
              params.tab_id = (+new Date() + '-' + Math.floor(Math.random() * 11));
              this.model.save('params', params);
            }
            this.id = 'tab-' + params.tab_id;
            this.$el.attr('id', this.id);
             //console && console.log('EtSubTabView.render() end');
            return this;
        },
	   ready:function (e) {

            window.EtSubTabView.__super__.ready.call(this, e);
            this.$tabs = this.$el.closest('.wpb_tabs_holder');
            var params = this.model.get('params');
             //console && console.log('EtSubTabView.ready() loading');
            return this;
        },
        changeShortcodeParams:function (model) {
             var params = model.get('params');
            window.EtSubTabView.__super__.changeShortcodeParams.call(this, model);
             //var params = model.get('params');
            if (_.isObject(params) && _.isString(params.tab_title) && _.isString(params.tab_id)) {
                $('.ui-tabs-nav [href=#tab-' + params.tab_id + ']').text(params.tab_title);
            }
            //console && console.log('EtSubTabView changeShortcodeParams loading');
        },
        deleteShortcode:function (e) {
            _.isObject(e) && e.preventDefault();
            var answer = confirm(window.i18nLocale.press_ok_to_delete_section),
                parent_id = this.model.get('parent_id');
            if (answer !== true) return false;
            this.model.destroy();
            if(!vc.shortcodes.where({parent_id: parent_id}).length) {
              vc.shortcodes.get(parent_id).destroy();
              return false;
            }
            var params = this.model.get('params'),
                current_tab_index = $('[href=#tab-' + params.tab_id + ']', this.$tabs).parent().index();
            $('[href=#tab-' + params.tab_id + ']').parent().remove();
            var tab_length = this.$tabs.find('.ui-tabs-nav li:not(.add_tab_block)').length;
            if(tab_length > 0) {
                this.$tabs.tabs('refresh');
            }
            if (current_tab_index < tab_length) {
                this.$tabs.tabs("option", "active", current_tab_index);
            } else if (tab_length > 0) {
                this.$tabs.tabs("option", "active", tab_length - 1);
            }
           // console && console.log('EtSubTabView.deleteShortcode loading');
        },
        cloneModel:function (model, parent_id, save_order) {
            var shortcodes_to_resort = [],
                new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                new_params = _.extend({}, model.get('params'));
            if (model.get('shortcode') === 'et_single') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.find('[data-element_type=et_single]').length + '-' + Math.floor(Math.random() * 11)});
            var model_clone = Shortcodes.create({shortcode:model.get('shortcode'), parent_id:parent_id, order:new_order, cloned:true, cloned_from:model.toJSON(), params:new_params});
            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
                this.cloneModel(shortcode, model_clone.id, true);
            }, this);
            //console && console.log('EtSubTabView.cloneModel loading');
            return model_clone;
        }
  
});

// Come from vc_map -> 'js_view' => 'EtSubTabView'


})(window.jQuery);