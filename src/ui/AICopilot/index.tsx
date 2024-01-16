import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Input, Space } from "antd";
import css from "./index.less";
import GlobalContext from "../globalContext";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface Message {
  role: "user" | "assistant";
  end?: boolean;
  content: string;
  cost?: {
    token: number;
    time: number;
  };
}

const GREETING = "您好，我是您的AI Copilot。请问有什么可以帮您？";

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

export default function () {
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

  const context = useContext(GlobalContext);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: GREETING,
    },
  ]);
  const [loading, setLoading] = useState(false);

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

  const generate = useCallback((demand: string) => {
    return axios
      .post("http://localhost:13000/api/ai/intent-conjecture2", {
        demand,
      })
      .then((res) => {
        console.log(res);
        const { data } = res;
        if (data.code === 1 && data.data) {
          let tokenCost = data.data.intentCost.usage.total_tokens;
          let timeCost = data.data.intentCost.time;
          let maxLogTimeCost = 0;
          data.data.logs.map((log) => {
            if (log.cost.vec.time + log.cost.generate.time > maxLogTimeCost) {
              maxLogTimeCost = log.cost.vec.time + log.cost.generate.time;
            }
            tokenCost += log.cost.generate.usage.total_tokens;
          });
          timeCost += maxLogTimeCost;
          console.log(data.data);
        } else {
          throw new Error();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const send = useCallback(() => {
    if (loading || !input) {
      return;
    }
    setMessages((pre) => [...pre, { role: "user", content: input }, { role: "assistant", content: "努力思考中..." }]);
    setMessagesLength((pre) => pre + 1);
    setLoading(true);
    setInput("");

    axios
      .post("http://localhost:13000/api/ai/confirmRequirement2", {
        messages: [...messages.slice(1), { role: "user", content: input }].map((item) => {
          if (item.role === "assistant") {
            return {
              role: item.role,
              content: item.content,
            };
          } else {
            return item;
          }
        }),
      })
      .then((res) => {
        setLoading(false);
        if (res.data.code === 1 && res.data.data) {
          console.log(res.data.data);
          setMessages((pre) => [
            ...pre.slice(0, -1),
            {
              ...res.data.data,
              end: res.data.data.content.includes("需求总结："),
              cost: {
                token: res.data.data.cost.usage.total_tokens,
                time: res.data.data.cost.time,
              },
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
            content: "抱歉，我暂时还不会哦。",
          },
        ]);
      });
  }, [loading, input]);

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
              AI Copilot
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
                    <Markdown rehypePlugins={[rehypeHighlight]}>{item.content}</Markdown>
                    {item.end && (
                      <div>
                        <Space>
                          <button className={css.button} onClick={() => generate(item.content.split('需求总结：')[1])}>
                            生成
                          </button>
                        </Space>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {item.cost && (
                    <div className={css.cost}>
                      <span>耗时：{item.cost.time} ms</span>
                      <span>耗费：{item.cost.token} token</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className={css.inputContainer}>
            <Input
              className={css.input}
              placeholder="请输入您的问题"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => {
                e.key === "Enter" && send();
              }}
            />
            <Button type="primary" className={css.button} disabled={loading ? true : false} onClick={send}>
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
