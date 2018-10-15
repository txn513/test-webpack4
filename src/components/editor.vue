<template>
    <textarea :id="id" :value="value"></textarea>
</template>
<script>
    import { uploadOthers} from '@/api/api';
    // Import TinyMCE
    import tinymce from 'tinymce/tinymce';
    import 'tinymce/themes/modern/theme';
    import 'tinymce/plugins/paste';
    import 'tinymce/themes/modern/theme'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'
    const INIT = 0;
    const CHANGED = 2;
    var EDITOR = null;
    export default {
        props: {
            value: {
                type: String,
                required: true
            },
            setting: {},
            isImage:{}
        },
        watch: {
            value: function (val) {
                console.log('init ' + val)
                if (this.status == INIT || tinymce.activeEditor.getContent() != val){
                    tinymce.activeEditor.setContent(val);
                }
                this.status = CHANGED

                tinymce.editors[0].getContent();
            }
        },
        data: function () {
            return {
                status: INIT,
                id: 'editor-'+new Date().getMilliseconds(),
            }
        },
        methods: {

        },
        mounted: function () {
            let plugins =  'link lists image code table colorpicker textcolor wordcount contextmenu';
            let toolbar =  'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat';
            if(!this.isImage){
                //可以上传图片
                plugins = plugins.replace("image",'');
                toolbar = toolbar.replace("image",'');
            }
            const _this = this;
            const setting =
                {
                    convert_urls: false ,//这个参数加上去就可以了
                    selector:'#'+_this.id,
                    language_url: './static/tinymce/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: './static/tinymce/skins/lightgray',
                    height: 300,
                    plugins: plugins,
                    toolbar: toolbar,
                    branding: false,
                    images_upload_handler: (blobInfo,success,failure)=>{
                        let fd = new FormData()
                        fd.append('file',blobInfo.blob())
                        uploadOthers(fd).then(res => {
                            success(this.GLOBAL.getImgUrl(res.data.relativePath));
                        }).catch(err => {

                        })
                    },
                    init_instance_callback:function(editor) {
                        EDITOR = editor;
                        console.log("Editor: " + editor.id + " is now initialized.");
                        editor.on('input change undo redo', () => {
                            var content = editor.getContent();
                            _this.$emit('input', content);
                        });
                    }
                };
            Object.assign(setting,_this.setting)
            tinymce.init(setting);
        },
        beforeDestroy: function () {
            tinymce.get(this.id).destroy();
        }
    }

</script>
