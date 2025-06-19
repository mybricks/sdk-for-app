import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, AutoComplete, Select } from "antd";
import css from "./index.less";
import GlobalContext from "../globalContext";
import axios from "axios";

interface Reference {
  score: number;
  tokenNum: number;
  id: string;
  title: string;
  category: string;
}

interface Answer {
  answer: string;
  type?: "TEXT" | "IMAGE";
  reference?: Reference[];
}

interface Message {
  role: "user" | "assistant";
  id?: number;
  isJudge?: boolean;
  content: string | Answer[];
}

type OptionList = Array<{ value: string }>;

const API_DOMAIN_SERVICE =
  "https://my.mybricks.world/runtime/api/domain/service/run";
const API_GET_TOTAL_CATEGORY_LIST =
  "https://my.mybricks.world/paas/api/gpt/knowledge-category";
const API_GET_QUESTION_LIST =
  "https://my.mybricks.world/paas/api/gpt/knowledge-docs";
const GREETING =
  "您好，我是您的AI小助手。请问有什么问题需要帮您解答吗？建议您优先选择问题分类，可以获得更精确的回答哦！";

function DocHelperSVG() {
  return (
    <svg
      t="1699521455480"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="29673"
      width="40"
      height="40"
    >
      <path
        d="M140.219733 482.304c-21.162667 7.748267-37.819733 22.971733-37.819733 40.994133v83.968c0 17.237333 15.530667 32.426667 37.819733 41.028267 8.021333 3.003733 16.896 1.706667 23.893334-3.549867a29.422933 29.422933 0 0 0 11.264-23.108266v-112.674134a29.422933 29.422933 0 0 0-11.264-23.108266 24.7808 24.7808 0 0 0-23.893334-3.549867z m746.632534 6.144a24.7808 24.7808 0 0 0-23.825067 3.584 29.422933 29.422933 0 0 0-11.298133 23.04v115.234133c-21.845333 14.574933-46.08 24.712533-71.509334 29.9008l-108.1344 3.652267a28.7744 28.7744 0 0 0-16.315733 6.144 16.110933 16.110933 0 0 0-5.3248 11.912533c0 8.977067 10.6496 16.384 22.7328 16.384l107.042133-4.096a240.776533 240.776533 0 0 0 103.253334-40.994133c22.3232-7.7824 37.853867-22.971733 37.853866-40.96v-83.626667c2.594133-17.237333-12.868267-32.392533-34.4064-40.174933h-0.068266z m-455.748267 21.7088h4.5056c19.319467 0 29.149867 8.977067 29.149867 26.282667v46.660266c0 17.646933-9.8304 26.248533-29.115734 26.248534h-4.539733c-19.6608 0-29.115733-8.533333-29.115733-26.2144v-46.728534c0-17.2032 9.4208-26.282667 29.0816-26.282666m176.64 0h4.573866c19.285333 0 29.115733 9.0112 29.115734 26.282666v46.6944c0 17.646933-9.8304 26.248533-29.0816 26.248534h-4.608c-19.6608 0-29.0816-8.533333-29.0816-26.2144v-46.728534c0-17.2032 9.4208-26.282667 29.0816-26.282666"
        fill="#5D6E7F"
        p-id="29674"
      ></path>
      <path
        d="M638.976 238.933333h-226.0992c-118.0672 0-214.084267 124.552533-214.084267 249.514667v104.6528C197.051733 716.117333 292.864 817.2544 412.8768 819.2h226.0992c75.264-2.2528 144.213333-43.485867 183.125333-109.4656a4.778667 4.778667 0 0 0 0-6.7584 3.822933 3.822933 0 0 0-3.4816 0l-23.620266 3.9936h-77.4144a151.4496 151.4496 0 0 1-49.152 7.509333h-263.304534c-57.582933-2.321067-104.209067-48.64-108.270933-107.52-4.061867-58.88 35.7376-111.5136 92.398933-122.129066 6.5536-71.509333 67.925333-124.484267 137.8304-118.954667h12.014934c69.905067-6.690133 132.096 45.431467 139.3664 116.974933v2.389334c50.5856 6.7584 90.2144 48.0256 96.017066 99.9424v12.6976-2.013867c0 11.025067-1.4336 21.981867-4.232533 32.5632 3.857067 2.7648 10.478933 0 15.837867 0a167.560533 167.560533 0 0 0 34.816-5.12c10.888533-3.6864 20.548267-10.103467 28.330666-18.670933v-116.224C852.718933 363.485867 757.077333 238.933333 638.976 238.933333z"
        fill="#5D6E7F"
        p-id="29675"
      ></path>
    </svg>
  );
}

export default function ({ userName }) {
  const messageListRef = useRef(null);

  const dialogRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dialogRefOffsetLeft = useRef(0);
  const dialogRefOffsetTop = useRef(0);
  const isDragging = useRef(false);

  const computeStyle = useRef((e) => {
    if (isDragging.current === false || !dialogRef.current) {
      return;
    }
    var nx = e.clientX;
    var ny = e.clientY;
    var nl = nx - (dragStartX.current - dialogRefOffsetLeft.current);
    var nt = ny - (dragStartY.current - dialogRefOffsetTop.current);
    dialogRef.current.style.left = nl + "px";
    dialogRef.current.style.top = nt + "px";
  });

  const [messagesLength, setMessagesLength] = useState(1);

  const [showDialog, setShowDialog] = useState(false);

  const [category, setCategory] = useState<string>();

  const [totalCategoryList, setTotalCategoryList] = useState<
    Array<{ category: string }>
  >([]);

  const getTotalCategoryList = useCallback(() => {
    axios
      .get(API_GET_TOTAL_CATEGORY_LIST,
        {
          withCredentials: false
        }
      )
      .then((res) => {
        if (res.data.code === 1 && res.data.data?.length) {
          setTotalCategoryList(res.data.data);
        }
      })
      .catch();
  }, []);

  const context = useContext(GlobalContext);

  const filterCategoryList = useCallback(
    (categoryKey?: string) => {
      if (categoryKey) {
        setFilteredCategoryList(
          totalCategoryList
            .map((item) => {
              if (item.category.includes(categoryKey)) {
                return { value: item.category };
              }
            })
            .filter((item) => !!item) as OptionList
        );
      } else {
        setFilteredCategoryList(
          totalCategoryList.map((item) => {
            return { value: item.category };
          })
        );
      }
    },
    [totalCategoryList]
  );

  const [filteredCategoryList, setFilteredCategoryList] = useState<OptionList>(
    []
  );

  const [question, setQuestion] = useState("");

  const [questionList, setQuestionList] = useState<string[]>([]);

  const [filteredQuestionList, setFilteredQuestionList] = useState<OptionList>(
    []
  );

  const getQuestionList = useCallback((category: string) => {
    axios.get(`${API_GET_QUESTION_LIST}?category=${category}`,
      {
        withCredentials: false
      }).then((res) => {
        if (res.data.code === 1 && res.data.data?.length) {
          setQuestionList(
            Array.from(new Set(res.data.data
              .map((item) => {
                return item.question.split("、");
              })
              .flat()))
          );
        }
      });
  }, []);

  const filterQuestionList = useCallback(
    (questionKey?: string) => {
      if (questionKey) {
        setFilteredQuestionList(
          questionList
            .map((item) => {
              if (item.includes(questionKey)) {
                return { value: item };
              }
            })
            .filter((item) => !!item) as OptionList
        );
      } else {
        setFilteredQuestionList(
          questionList.map((item) => {
            return { value: item };
          })
        );
      }
    },
    [questionList]
  );

  const clearCategory = useCallback(() => {
    setCategory(undefined);
    setQuestionList([]);
    setFilteredQuestionList([]);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: [
        {
          answer: GREETING,
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTotalCategoryList();
  }, []);

  const drag = useCallback((e) => {
    if (!dialogRef.current) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dialogRefOffsetLeft.current = dialogRef.current.offsetLeft;
    dialogRefOffsetTop.current = dialogRef.current.offsetTop;
    isDragging.current = true;
    window.addEventListener("mousemove", computeStyle.current);
  }, []);

  const endDrag = useCallback((e) => {
    isDragging.current = false;
    window.removeEventListener("mousemove", computeStyle.current);
  }, []);

  const closeDialog = useCallback(() => {
    setShowDialog(false);
    if (dialogRef.current) {
      dialogRef.current.style.right = 10 + "px";
      dialogRef.current.style.bottom = 10 + "px";
      dialogRef.current.style.top = "";
      dialogRef.current.style.left = "";
    }
  }, []);

  const send = useCallback(() => {
    if (loading || !question) {
      return;
    }
    setMessages((pre) => [
      ...pre,
      { role: "user", content: question },
      { role: "assistant", content: [{ answer: "努力思考中..." }] },
    ]);
    setMessagesLength((pre) => pre + 1);
    setLoading(true);
    setQuestion("");
    clearCategory();
    axios
      .post(
        API_DOMAIN_SERVICE,
        {
          serviceId: "u_lagjM",
          fileId: "492761247109189",
          projectId: 492761135968325,
          params: {
            用户: userName || context.user?.name || context.user?.email,
            问题: question,
            问题来源类型: questionList.includes(question) ? "预设" : "自定义",
            问题类型: questionList.includes(question) ? category : "",
          },
        },
        {
          headers: {
            // pragma: 'no-cache',
            // 'Cache-Control': 'no-cache'
          },
          withCredentials: false
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.code === 1 && res.data.data?.data?.length) {
          setMessages((pre) => [
            ...pre.slice(0, -1),
            {
              role: "assistant",
              id: res.data.data.id,
              content: res.data.data.data,
            },
          ]);
          setMessagesLength((pre) => pre + 1);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setMessages((pre) => [
          ...pre.slice(0, -1),
          {
            role: "assistant",
            content: [{ answer: "抱歉，我暂时还无法回答该问题。" }],
          },
        ]);
        /** 捕获异常后，清除加载中状态，不然 发送按钮的禁用状态 */
        setLoading(false)
      });
  }, [loading, question, questionList, category]);

  const judge = useCallback((id, score) => {
    axios
      .post(API_DOMAIN_SERVICE, {
        serviceId: "u_Zqa6w",
        fileId: "492761247109189",
        projectId: 492761135968325,
        params: {
          id,
          评价: score,
        },
      },
        {
          withCredentials: false
        }
      )
      .then((res) => {
        if (res.data.code === 1) {
          setMessages((pre) =>
            pre.map((item) => {
              if (item.id === id) {
                return { ...item, isJudge: true };
              } else {
                return item;
              }
            })
          );
        }
      });
  }, []);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div className={css.docHelper} ref={dialogRef}>
      {showDialog ? (
        <div className={css.dialog}>
          <div className={css.header}>
            <div className={css.title} onMouseDown={drag} onMouseUp={endDrag}>
              <DocHelperSVG />
              AI小助手
            </div>
            <div className={css.toolbar}>
              <div className={css.close} onClick={closeDialog}>
                <svg
                  t="1700203307845"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4435"
                  width="20"
                  height="20"
                >
                  <path
                    d="M807.6288 550.8096H224.2048c-17.5104 0-30.72-16.7936-30.72-38.7072s13.3632-38.7072 30.72-38.7072h583.424c17.5104 0 30.72 16.7936 30.72 38.7072s-14.0288 38.7072-30.72 38.7072z"
                    p-id="4436"
                    fill="#707070"
                  ></path>
                  <path
                    d="M807.5776 554.0352H224.2048c-19.456 0-34.0992-18.0224-34.0992-41.9328s14.6432-41.9328 34.0992-41.9328h583.3728c19.456 0 34.0992 18.0224 34.0992 41.9328 0 23.1424-15.2576 41.9328-34.0992 41.9328zM224.2048 476.6208c-15.7696 0-27.648 15.36-27.648 35.4816s11.8784 35.4816 27.648 35.4816h583.3728c15.36 0 27.648-15.9232 27.648-35.4816s-11.8784-35.4816-27.648-35.4816z"
                    p-id="4437"
                    fill="#707070"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <ul ref={messageListRef} className={css.messageList}>
            {messages.map((item) => (
              <li className={css.messageItem}>
                <div
                  className={css.messageBubble}
                  style={
                    item.role === "user"
                      ? { alignSelf: "flex-end", backgroundColor: "#fdf6e7" }
                      : { alignSelf: "flex-start" }
                  }
                >
                  <div>
                    {item.role === "user"
                      ? item.content
                      : item.content[0]?.answer}
                  </div>
                  {item.role === "assistant" && (
                    <div>
                      <div className={css.reference}>
                        {item.content[0]?.reference &&
                          item.content[0].reference.filter((item) => item.url)
                            .length > 0 && (
                            <div className={css.referenceLink}>
                              <h2>参考链接：</h2>
                              <ul className={css.referenceLinkList}>
                                {item.content[0].reference.map(
                                  (item) =>
                                    item.url && (
                                      <li className={css.referenceLinkItem}>
                                        <a href={item.url} target="_blank">
                                          {item.title}
                                        </a>
                                      </li>
                                    )
                                )}
                              </ul>
                            </div>
                          )}
                        {item.content[1]?.answer && (
                          <div className={css.referenceImg}>
                            <h2>参考图片：</h2>
                            <a href={item.content[1].answer} target="_blank">
                              <img src={item.content[1].answer}></img>
                            </a>
                          </div>
                        )}
                      </div>
                      {item.id && !item.isJudge && (
                        <div className={css.judgeContainer}>
                          <div
                            className={css.goodReview}
                            onClick={() => judge(item.id, 1)}
                          >
                            <svg
                              t="1699534278428"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="1285"
                              width="18"
                              height="18"
                            >
                              <path
                                d="M897.6 315.2H707.2c-6.4 0-11.2-3.2-12.8-6.4-1.6-1.6-4.8-6.4-4.8-14.4l9.6-76.8c9.6-72-30.4-140.8-96-163.2-40-14.4-81.6-11.2-118.4 9.6-36.8 19.2-62.4 54.4-72 94.4-1.6 8-8 22.4-12.8 30.4l-16 30.4c-20.8 38.4-70.4 94.4-104 126.4-8 6.4-14.4 14.4-19.2 24H144c-67.2 0-121.6 54.4-121.6 121.6v364.8c0 67.2 54.4 121.6 121.6 121.6h145.6V438.4c0-20.8 8-41.6 24-54.4 38.4-35.2 91.2-94.4 115.2-139.2l16-30.4c4.8-8 14.4-27.2 17.6-41.6 6.4-27.2 24-49.6 48-62.4 24-12.8 52.8-16 78.4-6.4 43.2 14.4 68.8 60.8 62.4 110.4l-9.6 73.6c-3.2 19.2 3.2 38.4 16 52.8 12.8 14.4 30.4 22.4 49.6 22.4H896c40 0 72 32 73.6 70.4l-94.4 403.2v3.2c-6.4 32-30.4 88-121.6 88H483.2c-12.8 0-24 11.2-24 24s11.2 24 24 24h270.4c136 0 164.8-97.6 169.6-128l94.4-404.8v-4.8c0-68.8-54.4-123.2-120-123.2zM241.6 928H144c-40 0-73.6-32-73.6-73.6V491.2c0-40 32-73.6 73.6-73.6h97.6V928z"
                                fill="#bfbfbf"
                                p-id="1286"
                              ></path>
                            </svg>
                            已解决
                          </div>
                          <div
                            className={css.badReview}
                            onClick={() => judge(item.id, 0)}
                          >
                            <svg
                              t="1699534222621"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="33657"
                              width="18"
                              height="18"
                            >
                              <path
                                d="M1022.4 580.8L928 176c-6.4-30.4-35.2-128-169.6-128H488c-14.4 0-24 11.2-24 24S473.6 96 488 96h270.4c91.2 0 115.2 54.4 121.6 88v3.2l94.4 403.2c-1.6 40-33.6 70.4-73.6 70.4H712c-19.2 0-36.8 8-49.6 22.4-12.8 14.4-17.6 33.6-16 52.8l9.6 76.8c6.4 49.6-20.8 96-62.4 110.4-27.2 9.6-54.4 6.4-78.4-6.4-24-12.8-41.6-36.8-48-62.4-3.2-14.4-12.8-33.6-17.6-41.6l-16-30.4c-24-44.8-75.2-104-115.2-139.2-16-14.4-24-33.6-24-54.4V46.4H148.8c-67.2 0-121.6 54.4-121.6 121.6v364.8c0 67.2 54.4 121.6 121.6 121.6h118.4c4.8 8 11.2 16 19.2 24 35.2 32 83.2 86.4 104 126.4l16 30.4c4.8 9.6 11.2 22.4 12.8 30.4 9.6 40 36.8 75.2 72 94.4 36.8 19.2 78.4 22.4 118.4 9.6 64-22.4 104-91.2 96-163.2l-9.6-76.8c-1.6-6.4 1.6-11.2 4.8-14.4 1.6-1.6 6.4-6.4 12.8-6.4h188.8c67.2 0 121.6-54.4 121.6-121.6l-1.6-6.4z m-777.6 24h-96c-40 0-73.6-32-73.6-73.6V168C75.2 128 108.8 96 148.8 96h97.6v508.8z"
                                fill="#bfbfbf"
                                p-id="33658"
                              ></path>
                            </svg>
                            未解决
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className={css.inputContainer}>
            <Select
              className={css.category}
              placeholder="类别(可选)"
              allowClear
              showSearch
              value={category}
              options={filteredCategoryList}
              onFocus={() => {
                filterCategoryList();
              }}
              onSearch={(categoryKey) => filterCategoryList(categoryKey)}
              onSelect={getQuestionList}
              onChange={(e) => setCategory(e)}
              onClear={clearCategory}
            />
            <AutoComplete
              className={css.question}
              placeholder="请输入您的问题"
              value={question}
              options={filteredQuestionList}
              onFocus={() => filterQuestionList()}
              onChange={(e) => setQuestion(e)}
              onSearch={(questionKey) => filterQuestionList(questionKey)}
              onKeyUp={(e) => {
                e.key === "Enter" && send();
              }}
            />
            <Button
              type="primary"
              className={css.button}
              disabled={loading ? true : false}
              onClick={send}
            >
              发送
            </Button>
          </div>
        </div>
      ) : (
        <div className={css.entry} onClick={() => setShowDialog(true)}>
          <DocHelperSVG />
        </div>
      )}
    </div>
  );
}
