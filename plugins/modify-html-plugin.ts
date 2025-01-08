import { IApi } from 'umi'

export default (api: IApi) => {
  api.describe({
    key: 'addLoadingToHtml',
    enableBy: () => true,
  })

  api.addHTMLStyles(() => {
    return `
      html,
      body,
      #root {
        box-sizing: border-box;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: transparent;
      }

      .initLoadingContainer {
        box-sizing: border-box;
        padding: 50px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
      }

      .initLoadingTitle {
        color: #ccc;
        font-weight: bold;
        font-size: 48px;
        text-align: center;
      }

      .initLoading {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .initLoadingText {
        margin-top: 10px;
        font-size: 14px;
      }

      .initloadingFooter {
        font-size: 14px;
      }

      @keyframes weuiLoading {
        0% {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(1turn);
        }
      }

      @keyframes show {
        0% {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .initLoadingIcon {
        display: block;
        width: 22px;
        height: 22px;
        background: transparent
          url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)
          no-repeat;
        background-size: 100%;
        animation: weuiLoading 0.6s steps(12, end) infinite, show 0.9s;
      }

      .loading-text {
        background: linear-gradient(90deg, #ccc, #eee, #ccc);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient 2s linear infinite;
      }

      @keyframes gradient {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }
    `
  })

  api.modifyHTML(($, { path }) => {
    const page = $(
      `<div class="initLoadingContainer">
        <div class="initLoadingTitle loading-text">REACT ADMIN STARTER</div>
        <div class="initLoading">
          <div class="initLoadingIcon"></div>
          <div class="initLoadingText loading-text">加载中</div>
        </div>
        <div class="initLoadingFooter">©${new Date().getFullYear()} </div>
      </div>`
    )

    $('#root').append(page)
    return $
  })
}
