import {defineComponent} from 'vue'
import Route from '../Route.vue'
import {router} from "../../utils/router";
import {getUrl, request} from "../../utils/request";
import {clearUserInfo} from "../../utils/user";
import event, {menuNavigation} from '../../utils/event';
import {weather} from "../../utils/util";

export default defineComponent({
  props: {
    'title': {
      type: String,
    },
    'form': {
      type: Boolean,
      default: false
    },
    'onSubmit': {
      type: Function,
    }
  },
  components: {
    Route
  },
  data() {
    return {
      darkMode: localStorage.getItem("darkMode") === "dark" ? "dark" : "light",
      navList: [],
      weather: {}
    }
  },
  created() {
    weather((res) => {
      this.weather = res
    })
  },
  mounted() {
    menuNavigation.on(data => {
      this.navList = data
    })
  },
  render() {
    const {navList} = this
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none px-4 py-2 border-b border-gray-300 dark:border-blackgray-5 bg-white dark:bg-blackgray-4 shadow-sm  z-10">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow">
            <a-breadcrumb>
              {
                navList.map((item, index) => <a-breadcrumb-item><Route href={item.url}>{item.name}</Route></a-breadcrumb-item>)
              }
            </a-breadcrumb>
          </div>
          <div class="flex-none flex items-center gap-2">
            {this.$slots.tools?.()}
            {this.weather.city && <div>
              <a href="http://www.weather.com.cn/" target="_blank" class="dark:hover:bg-blackgray-2 hover:bg-gray-100 p-2 rounded">{this.weather.city} {this.weather.weather} {this.weather.temperature}°</a>
            </div>}
            <div>
              <a-button type="text" shape="round" style={{fontSize: '20px'}} onClick={() => {
                this.darkMode = this.darkMode === 'dark' ? 'light' : 'dark'
                event.emit('switch-dark', this.darkMode)
              }}>
                {{
                  icon: () => this.darkMode === 'light' ? <icon-sun-fill/> : <icon-moon-fill/>
                }}

              </a-button>
            </div>
            <div>
              <a-dropdown>
                {
                  {
                    default: () => <div class="flex items-center gap-2 px-2 cursor-pointer">
                      <a-avatar size="28">A</a-avatar>
                      <div>姓名</div>
                    </div>,
                    content: () => <div>
                      <a-doption onClick={() => {
                        window.open("/")
                      }}>返回首页
                      </a-doption>
                      <a-doption onClick={() => {
                        router.push(getUrl("/userInfo/page"))
                      }}>修改资料
                      </a-doption>
                      <a-doption onClick={() => {
                        clearUserInfo();
                        window.location.replace(
                          window.location.pathname.split("/")[0] || "/"
                        )
                      }}>退出登录
                      </a-doption>
                    </div>
                  }
                }
              </a-dropdown>
            </div>
          </div>
        </div>}
      </div>
      <div class="flex-grow bg-gray-100 dark:bg-blackgray-2 overflow-y-auto app-scrollbar">

        <div class="p-5 pb-0 flex">
          <div class="flex-grow">
            <a-breadcrumb>
              {
                navList.map((item, index) => <a-breadcrumb-item>{item.name}</a-breadcrumb-item>)
              }
            </a-breadcrumb>
          </div>
          {this.form && <div class="flex-none flex gap-2">
            <route type="back">
              <a-button type="outline">
                返回
              </a-button>
            </route>
            <a-button type="primary" html-type={this.submit ? 'button' : 'submit'} onClick={this.submit || null}>保存</a-button>
          </div>
          }
        </div>

        {this.$slots.default?.({navList})}
      </div>
    </div>
  }
})
