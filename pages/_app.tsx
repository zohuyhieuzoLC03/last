import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import supabase from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps }: AppProps) => {
  const handlePayload = (payload: any) => {
    const title = payload.new?.title || "New video post";
    // add who share
    const user = payload.new?.authorName || "Anonymous";
    toast.info(`${user} shared a new video: ${title}`);
  };

  supabase
    .channel("realtime: video post")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "VideoPost" },
      (payload) => {
        console.log(payload)
        handlePayload(payload);
      }
    )
    .subscribe();

  return (
    <SessionProvider session={pageProps.session}>
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
