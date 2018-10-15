import Vue from 'vue'
import VueI18n from 'vue-i18n'
import util from './common/js/util'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale:  util.getCookie('PLAY_LANG', 'zh'),  // 语言标识
    messages: {
        'zh': require('./common/lang/zh'),
        'en': require('./common/lang/en')
    },

})

export default i18n;
