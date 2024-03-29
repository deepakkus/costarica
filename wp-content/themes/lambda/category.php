<?php
/**
 * Displays the main body of the theme
 *
 * @package Lambda
 * @subpackage Frontend
 * @since 0.1
 *
 * @copyright (c) 2015 Oxygenna.com
 * @license http://wiki.envato.com/support/legal-terms/licensing-terms/
 * @version 1.27.0
 */

get_header();
oxy_blog_header(single_cat_title('', false));
// if masonry option set then use masonry option for name otherwise use blog style
$name = oxy_get_option('blog_masonry') === 'no-masonry' ? oxy_get_option('blog_style') : oxy_get_option('blog_masonry');
get_template_part('partials/blog/list/' . $name);
get_footer();