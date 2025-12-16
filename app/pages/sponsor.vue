<template>
  <div class="sponsor-container">
        <div class="sponsor-card">
          <div class="header">
            <div class="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#8b5a8c"/>
              </svg>
            </div>
            <h1 class="title">赞助支持</h1>
            <p class="subtitle">您的每一份支持都是我们前进的动力，让我们共同创造更多可能 ✨。</p>
          </div>

          <div class="qr-codes">
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[0] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 0)"
              @mouseleave="() => handleQrCardMouseLeave(0)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[0]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[0]?.x - 80 + 'px',
                  top: qrCardEffects[0]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(7, 193, 96, 0.6) 0%, rgba(7, 193, 96, 0.3) 30%, rgba(7, 193, 96, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(7, 193, 96, 0.5), 0 0 160px rgba(7, 193, 96, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg t="1765643783349" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8792" width="32" height="32"><path d="M648.76385 387.55778c9.614985 0 19.127639 0.706081 28.563546 1.757017-25.665543-119.509884-153.434531-208.30421-299.276131-208.30421-163.049516 0-296.611441 111.138216-296.611441 252.264421 0 81.462337 44.436048 148.356886 118.690216 200.24158l-29.66667 89.228207 103.690594-51.997258c37.103036 7.344269 66.871013 14.895245 103.898325 14.895245 9.30697 0 18.537192-0.459464 27.689642-1.178849-5.794983-19.831674-9.152451-40.602743-9.152451-62.153571-0.001023-129.58638 111.279433-234.752582 252.17437-234.752582z m-159.484318-80.422658c22.333658 0 37.128619 14.69263 37.128619 37.012986 0 22.231327-14.794961 37.128619-37.128619 37.128618-22.231327 0-44.537356-14.897292-44.537355-37.128618 0-22.319331 22.307052-37.012985 44.537355-37.012986z m-207.587895 74.141604c-22.228257 0-44.664246-14.897292-44.664246-37.128618 0-22.320355 22.435988-37.012985 44.664246-37.012986 22.230304 0 37.026288 14.69263 37.026288 37.012986 0 22.231327-14.794961 37.128619-37.026288 37.128618z" fill="#07c160" p-id="8793"></path><path d="M170.461323 738.889497c-3.805676 0-7.568373-1.340531-10.564613-3.936659a16.147772 16.147772 0 0 1-4.761444-17.302061l25.922393-77.976956c-75.800383-56.343239-115.76663-127.492696-115.76663-206.398813 0-148.005892 140.30142-268.413216 312.757166-268.413216 151.496389 0 286.130739 93.717452 314.491671 218.451314a16.037255 16.037255 0 0 1 1.146103 6.002714c0 8.919137-7.221472 16.145725-16.145725 16.145725h-0.209778a15.738449 15.738449 0 0 1-1.786693-0.100284c-10.006911-1.11438-18.763342-1.655709-26.773783-1.655709-130.146129 0-236.031714 98.064456-236.031715 218.603786 0 18.937305 2.859118 38.325887 8.493442 57.630559a16.123212 16.123212 0 0 1-2.207272 13.696953 16.126282 16.126282 0 0 1-12.014638 6.92676c-10.490935 0.824785-19.961634 1.224898-28.959565 1.224897-32.755008 0-60.506049-5.697769-89.886193-11.726065-3.847631-0.787946-7.747451-1.592264-11.731182-2.396583l-98.726536 49.510623a16.163121 16.163121 0 0 1-7.245008 1.713015z m207.586872-541.735232c-154.649196 0-280.465716 105.922425-280.465716 236.121766 0 72.252581 37.611619 135.171586 111.793132 187.005114a16.153912 16.153912 0 0 1 6.075369 18.327414l-17.365506 52.222386 68.820412-34.515095a16.084327 16.084327 0 0 1 10.375301-1.408069 2868.182988 2868.182988 0 0 1 17.37574 3.521196c31.272237 6.417153 57.415664 11.789511 90.695628 10.973936-3.258207-15.768125-4.9088-31.540344-4.9088-47.092551 0-138.345881 120.370485-250.895237 268.324188-250.895237 2.270716 0 4.583388 0.036839 6.948249 0.110517-33.878598-100.784404-148.856259-174.371376-277.667997-174.371377zM489.283626 397.424498c-29.1806 0-60.685127-20.366863-60.685128-53.27332 0-32.838919 31.503505-53.163827 60.685128-53.163827 31.367405 0 53.273321 21.858844 53.27332 53.163827 0.001023 31.366382-21.905916 53.273321-53.27332 53.27332z m0-74.144674c-13.707187 0-28.392654 8.388041-28.392654 20.871354 0 12.550851 14.685467 20.98187 28.392654 20.98187 13.328563 0 20.98187-7.647167 20.98187-20.98187 0-13.46057-7.452739-20.871353-20.98187-20.871354zM281.696754 397.424498c-29.244045 0-60.810994-20.366863-60.810995-53.27332 0-32.838919 31.56695-53.163827 60.810995-53.163827 31.30396 0 53.168943 21.858844 53.168943 53.163827 0 31.366382-21.864984 53.273321-53.168943 53.27332z m0-74.144674c-13.770632 0-28.51852 8.388041-28.518521 20.871354 0 12.366655 15.032368 20.98187 28.518521 20.98187 13.266142 0 20.87647-7.647167 20.876469-20.98187 0-13.266142-7.610328-20.871353-20.876469-20.871354z" fill="#07c160" p-id="8794"></path><path d="M942.566316 631.498628c0-118.587885-118.66668-215.252459-251.945149-215.252459-141.126204 0-252.277724 96.664573-252.277724 215.252459 0 118.792547 111.151519 215.252459 252.277724 215.252459 29.537733 0 59.33027-7.448646 88.997963-14.885012l81.356936 44.551682-22.307052-74.126255c59.538001-44.666292 103.897302-103.897302 103.897302-170.792874z m-333.74006-37.115316c-14.769378 0-29.66667-14.69263-29.66667-29.679973 0-14.779611 14.897292-29.6636 29.66667-29.6636 22.435988 0 37.128619 14.885012 37.128619 29.6636 0 14.987343-14.69263 29.679973-37.128619 29.679973z m163.15287 0c-14.667048 0-29.462009-14.69263-29.462009-29.679973 0-14.779611 14.794961-29.6636 29.462009-29.6636 22.230304 0 37.125549 14.885012 37.125549 29.6636 0 14.987343-14.895245 29.679973-37.125549 29.679973z" fill="#07c160" p-id="8795"></path><path d="M860.981183 892.561435c-2.659573 0-5.329379-0.651846-7.757685-1.98112l-75.810616-41.516556c-28.223808 7.043417-57.310264 13.833053-86.795808 13.833053-148.005892 0-268.418332-103.804181-268.418333-231.396137 0-127.597073 120.41244-231.401254 268.418333-231.401254 145.325853 0 268.092921 105.969497 268.092921 231.401254 0 62.292742-35.897581 124.727723-101.375876 176.777169l19.110244 63.4808a16.130376 16.130376 0 0 1-5.297656 17.197684 16.096607 16.096607 0 0 1-10.165524 3.605107z m-81.361029-76.841085c2.691295 0 5.361101 0.672312 7.757684 1.98112l46.777373 25.617448-10.95347-36.370349a16.147772 16.147772 0 0 1 5.771447-17.570168c62.839187-47.140647 97.444333-103.20964 97.444333-157.876703 0-107.930151-107.987457-199.10878-235.800447-199.10878-130.199341 0-236.126882 89.318258-236.126882 199.10878 0 109.785405 105.927541 199.103664 236.126882 199.103664 27.635407 0 56.837496-7.321756 85.071537-14.400989a16.390295 16.390295 0 0 1 3.931543-0.484023z m-7.642051-205.190289c-23.87271 0-45.610804-21.843494-45.610804-45.825699 0-23.546276 22.168905-45.810349 45.610804-45.810348 29.380144 0 53.273321 20.551058 53.273321 45.810348 0 25.270547-23.893176 45.825698-53.273321 45.825699z m0-59.344597c-5.728468 0-13.31833 7.705496-13.31833 13.517875 0 5.944386 7.462972 13.534248 13.31833 13.534248 13.507642 0 20.98187-8.004301 20.98187-13.534248-0.001023-5.522784-7.474228-13.517875-20.98187-13.517875z m-163.153894 59.344597c-23.977088 0-45.810349-21.843494-45.810348-45.825699 0-23.546276 22.264073-45.810349 45.810348-45.810348 32.902364 0 53.273321 23.777543 53.273321 45.810348 0 22.526039-19.929912 45.825698-53.273321 45.825699z m0-59.344597c-5.813403 0-13.517875 7.705496-13.517875 13.517875 0 5.944386 7.578606 13.534248 13.517875 13.534248 13.68672 0 20.98187-7.857968 20.98187-13.534248-0.001023-5.522784-7.474228-13.517875-20.98187-13.517875z" fill="#07c160" p-id="8796"></path></svg>
              </div>
              <h3>微信支付</h3>
              <div class="qr-placeholder">
                <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/weixin.webp" alt="微信二维码">
              </div>
              <p class="qr-description">扫一扫，请我喝杯咖啡</p>
            </div>
            
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[1] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 1)"
              @mouseleave="() => handleQrCardMouseLeave(1)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[1]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[1]?.x - 80 + 'px',
                  top: qrCardEffects[1]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(22, 119, 255, 0.6) 0%, rgba(22, 119, 255, 0.3) 30%, rgba(22, 119, 255, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(22, 119, 255, 0.5), 0 0 160px rgba(22, 119, 255, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path fill="#1677ff" d="M24 0c13.255 0 24 10.745 24 24S37.255 48 24 48S0 37.255 0 24S10.745 0 24 0m0 4.364C13.155 4.364 4.364 13.155 4.364 24S13.155 43.636 24 43.636c6.738 0 12.683-3.393 16.22-8.565a64 64 0 0 1-6.683-2.402q-1.855-.78-5.541-2.459C25.056 33.173 20.769 36 16.174 36c-3.188-.016-8.538-1.627-8.538-6.654s4.956-6.224 8.172-6.224q2.919 0 10.33 3.222l.077.03q1.989-2.434 2.73-5.653l.1-.464h-12.87v-2.32h5.857v-2.9h-8.201v-1.74h8.201l.001-3.479h4.687v3.48h9.374v1.74H26.72v2.899h7.486q-.165 1.086-.371 1.973l-.084.347q-.517 1.868-2.325 5.442c-.32.632-.782 1.364-1.366 2.139q2.766 1.024 5.6 1.99q3.67 1.249 6.345 2.02A19.6 19.6 0 0 0 43.636 24c0-10.845-8.791-19.636-19.636-19.636m-13.685 24.18c0 3.198 6.69 4.472 12.11 1.106q.915-.57 1.71-1.213l-.018-.008l-.427-.262q-5.074-3.087-7.882-3.348c-1.719-.159-5.493.527-5.493 3.725m18.73-8.287h2.209z"/></svg>
              </div>
              <h3>支付宝</h3>
              <div class="qr-placeholder">
                <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/alipay.webp" alt="支付宝二维码">
              </div>
              <p class="qr-description">扫一扫，请我喝杯咖啡</p>
            </div>
            
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[2] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 2)"
              @mouseleave="() => handleQrCardMouseLeave(2)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[2]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[2]?.x - 80 + 'px',
                  top: qrCardEffects[2]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.3) 30%, rgba(236, 72, 153, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(236, 72, 153, 0.5), 0 0 160px rgba(236, 72, 153, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg t="1765643606889" class="icon" viewBox="0 0 1322 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6173" width="32" height="32"><path d="M495.899049 634.906371c-17.304811 0-31.251971 13.947161-31.251971 31.251971S478.594238 697.410314 495.899049 697.410314c17.304811 0 31.251971-13.947161 31.251971-31.251972 0-17.304811-13.947161-31.251971-31.251971-31.251971zM790.855671 728.662285c-17.304811 0-31.251971 13.947161-31.251972 31.251971s13.947161 31.251971 31.251972 31.251972 31.251971-13.947161 31.251971-31.251972c0-17.04653-13.947161-30.993691-31.251971-31.251971z" fill="#ec4899" p-id="6174"></path><path d="M1262.99289 719.622459c-13.430599-8.264984-28.927445-13.430599-44.68257-14.980284 34.867902-84.974368 57.080047-196.293374-18.596215-306.837537-115.193217-168.657333-280.75118-256.73107-491.766556-260.863562-60.179416-1.291404-130.948343 1.549685-205.849762 4.649054-87.040614 3.35765-203.008673 8.006703-281.526023 1.549684 15.755126-8.523265 32.543375-16.788249 47.007098-23.761829 55.530362-27.119479 98.921529-48.04022 84.457807-85.232649-7.748423-21.695583-30.218848-33.059937-67.411277-34.09306C206.624604-1.755689 37.967271 43.443443 7.748423 119.636265c-17.04653 42.874605-19.887618 125.524447 152.902206 198.876182 71.027208 30.218848 271.969635 66.894715 349.453861 74.643138 17.563091 1.549685 34.867902 5.165615 51.397871 11.364353-17.821372 11.622634-35.901025 24.02011-54.238959 36.417586-31.768533-18.079653-83.941245-39.516955-122.683358-13.172318-14.463722 9.298107-23.503549 25.053233-24.02011 42.358044-0.516562 21.179022 12.397476 42.099763 26.861198 58.629731-57.080047 45.715694-103.312302 89.881703-119.84227 123.974762-18.337934 41.841482-25.828075 110.544163 8.523265 177.438879 43.391167 84.974368 138.955046 144.120661 284.625391 176.147474 190.352916 41.583202 354.619476 4.132492 463.355674-53.205835 60.437697-32.026814 103.570583-69.994085 124.233043-103.828864 6.457019 2.066246 12.914038 4.132492 19.629338 6.198738 9.298107 2.841088 18.596214 5.682177 27.37776 8.781546 28.669164 10.072949 60.695977 8.523265 85.232649-3.61593l1.291403-0.774843c17.821372-9.039826 31.510252-25.053233 37.708991-44.166009 15.238565-51.139589-29.444006-79.033911-56.563486-96.08044z m-811.776412-239.684541l-17.30481 12.655757c-5.165615-5.165615-9.814669-11.106072-13.430599-17.563091 6.7153-2.066246 18.337934 0.258281 30.735409 4.907334zM1262.99289 798.139808c-1.291404 3.874211-4.132492 6.97358-9.298107 9.814669-10.33123 5.165615-25.569795 5.423896-39.258675 0.774842-9.298107-3.35765-19.371057-6.457019-29.444006-9.556388-18.596214-5.682177-49.848186-15.238565-55.788643-22.470426-9.814669-12.914038-28.152602-15.755126-41.32492-5.940457s-15.755126 28.152602-5.940458 41.324921c3.615931 4.390773 7.490142 8.264984 12.139196 11.622634-44.940851 62.245662-242.267348 186.220424-521.468844 125.007885-125.782728-27.636041-210.498815-77.742507-244.850155-145.412065-24.794952-48.815063-19.112776-98.921529-7.231861-126.299289 34.09306-71.027208 280.75118-234.518925 438.30244-327.241716 13.947161-8.264984 18.596214-26.344637 10.33123-40.291798s-27.119479-19.629337-40.291797-10.33123c-12.655757 7.490142-55.788643 33.059937-111.060725 68.186119-18.596214-12.655757-50.881309-27.894322-102.537459-33.059936-81.874999-8.264984-270.936512-44.42429-332.149051-70.252366C139.471608 245.418993 40.033517 196.34565 61.987381 141.073568c5.165615-12.914038 29.185725-33.576498 81.100157-53.464116 35.384463-13.430599 72.318611-22.470426 109.769321-27.119479l-11.622634 5.682176c-35.384463 17.304811-73.868296 36.417586-99.954652 59.146293-1.807965-1.033123-3.615931-2.324527-5.165615-3.874211-10.847792-11.622634-29.185725-12.397476-41.06664-1.291404l-0.516562 0.516561c-11.880915 11.106072-12.139195 29.702287-1.033123 41.583202 10.589511 11.106072 26.086356 19.371057 45.715694 25.569795 0.774842 0.258281 1.291404 0.516562 2.066246 0.774842 68.702681 21.179022 190.611197 18.596214 362.367899 11.622634 74.126577-2.841088 144.120661-5.682177 202.492111-4.649054 193.710566 3.874211 339.122631 80.841876 444.75946 235.552049 64.828469 95.047318 41.583202 188.544951 4.390773 269.903388-4.649054-3.615931-9.039826-7.748423-12.655757-12.139195-10.33123-12.397476-28.669164-14.463722-41.324921-4.649054-12.655757 10.072949-14.722003 28.669164-4.649054 41.324921 5.940457 7.490142 36.675867 42.874605 74.643138 39.775236h2.066246c1.291404-0.258281 2.324527 0 3.615931-0.258281 25.828075-4.649054 42.358044-3.615931 57.596608 6.198738 20.40418 12.914038 30.218848 20.40418 28.410883 26.861199z" fill="#ec4899" p-id="6175"></path></svg>
              </div>
              <h3>爱发电支持</h3>
              <div class="qr-placeholder">
                <img src="https://imgbed.mcyzsx.top/file/custom/Vuaj4DpO.jpg" alt="爱发电二维码">
              </div>
              <p class="qr-description">在爱发电上支持我</p>
              <div class="qr-actions">
                <a href="https://afdian.com/a/zsxcoder" class="afdian-link" target="_blank">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <path d="M15 3h6v6"/>
                    <path d="M10 14L21 3"/>
                  </svg>
                  前往爱发电
                </a>
              </div>
            </div>
          </div>
          
          <div class="notice">
            <div class="notice-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <p class="notice-text">
              <strong>重要提示：</strong>赞助了一定要给 <a href="mailto:me@mcyzsx.top" class="email">me@mcyzsx.top</a>发邮件，表明渠道和单号，和你自己名称和内容，否则我认不清可能加不上。
            </p>
          </div>
          
          <div class="sponsors-table">
            <h2>赞助名单</h2>
            <table>
              <thead>
                <tr>
                  <th>赞助者</th>
                  <th>日期</th>
                  <th>寄语</th>
                  <th>金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sponsor, index) in sponsors" :key="index">
                  <td>{{ sponsor.name }}</td>
                  <td>{{ sponsor.date }}</td>
                  <td>{{ sponsor.message }}</td>
                  <td>{{ sponsor.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { siteConfig, getPageConfig } from '~/config'
import sponsorsData from '@/data/sponsors.json'

// 页面配置
const pageConfig = getPageConfig('sponsor')

// 设置页面元数据
definePageMeta({
  title: pageConfig.title
})

useHead({
  title: `${pageConfig.title} - ${siteConfig.site.title}`,
  meta: [
    { name: 'description', content: pageConfig.description }
  ]
})

const sponsors = ref(sponsorsData)

const qrCardRefs = ref<HTMLElement[]>([])
const qrCardEffects = reactive<Record<number, { x: number; y: number; show: boolean }>>({})

const handleQrCardMouseMove = (event: MouseEvent, index: number) => {
  const card = qrCardRefs.value[index]
  if (!card) return
  
  const rect = card.getBoundingClientRect()
  qrCardEffects[index] = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    show: true
  }
}

const handleQrCardMouseLeave = (index: number) => {
  if (qrCardEffects[index]) {
    qrCardEffects[index].show = false
  }
}
</script>

<style scoped>
.sponsor-container {
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
  padding: 60px 16px 80px 16px;
}

@media (min-width: 640px) {
  .sponsor-container {
    padding: 80px 24px 80px 24px;
  }
}

@media (min-width: 1024px) {
  .sponsor-container {
    padding: 80px 32px 80px 32px;
  }
}

.sponsor-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.dark .sponsor-card {
  background: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.header {
  margin-bottom: 48px;
}

.icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.dark .title {
  color: rgba(255, 255, 255, 0.95);
}

.subtitle {
  font-size: 18px;
  color: #6b7280;
  font-weight: 400;
}

.dark .subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.qr-codes {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin: 32px 0;
}

@media (max-width: 768px) {
  .qr-codes {
    flex-direction: column;
    align-items: center;
  }
}

.qr-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.dark .qr-card {
  background: #1f2937;
  border: 1px solid #374151;
}

.qr-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.qr-card h3 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 24px 0;
}

.dark .qr-card h3 {
  color: white;
}

.qr-placeholder {
  width: 160px;
  height: 160px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.dark .qr-placeholder {
  background: #374151;
  border: 1px solid #4b5563;
}

.qr-placeholder img {
  width: 140px;
  height: 140px;
  border-radius: 8px;
}

.qr-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.dark .qr-description {
  color: rgba(255, 255, 255, 0.7);
}

.afdian-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  color: #374151;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
}

.dark .afdian-link {
  background: #374151;
  color: #f9fafb;
  border: 1px solid #4b5563;
}

.afdian-link:hover {
  background: #f3f4f6;
}

.dark .afdian-link:hover {
  background: #4b5563;
}

.notice {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  margin-top: 24px;
  text-align: center;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dark .notice {
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
}

.notice-text {
  color: #1e40af;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  flex: 1;
  text-align: left;
}

.dark .notice-text {
  color: #cbd5e1;
}

.notice-text strong {
  color: #dc2626;
  font-weight: 600;
}

.dark .notice-text strong {
  color: #f87171;
}

.email {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: monospace;
}

.dark .email {
  color: #93c5fd;
  background: #334155;
}

.email:hover {
  background: #e2e8f0;
}

.dark .email:hover {
  background: #475569;
}

.sponsors-table {
  margin-top: 48px;
}

.sponsors-table h2 {
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.dark .sponsors-table h2 {
  color: white;
}

.sponsors-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dark .sponsors-table table {
  background: #111827;
  border: 1px solid #374151;
}

.sponsors-table th,
.sponsors-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.dark .sponsors-table th,
.dark .sponsors-table td {
  border-bottom: 1px solid #374151;
}

.sponsors-table th {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.025em;
}

.dark .sponsors-table th {
  background: #1f2937;
  color: #f3f4f6;
}

.sponsors-table td {
  color: #6b7280;
  font-size: 14px;
}

.dark .sponsors-table td {
  color: #d1d5db;
}

.sponsors-table tbody tr:hover {
  background: #f9fafb;
}

.dark .sponsors-table tbody tr:hover {
  background: #1f2937;
}

.sponsors-table tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .sponsor-container {
    padding: 40px 16px 60px 16px;
  }
  
  .sponsor-card {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .qr-codes {
    flex-direction: column;
    align-items: center;
  }
  
  .sponsors-table {
    overflow-x: auto;
  }
  
  .sponsors-table table {
    min-width: 500px;
  }
  
  .qr-card {
    padding: 24px 20px;
  }
  
  .qr-card img {
    width: 160px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .sponsor-container {
    padding: 24px 12px 40px 12px;
  }
  
  .sponsor-card {
    padding: 24px 20px;
  }
  
  .header {
    margin-bottom: 32px;
  }
  
  .notice {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }
}
</style>