
export default function HomeSideBar () {
  return (
    <>
      <div className="flex flex-col h-full w-28 border-r-2 border-solid border-r-black">
        <div className="m-2"><p className="text-white font-bold">Saywer</p></div>
        <div>
          <p>Friend</p>
          <div>
            <div>在线</div>
            <div>全部</div>
            <div>请求</div>
          </div>
        </div>
        <div>
          <p>Inbox</p>
          <div>
            <div>系统通知</div>
            <div>私信</div>
          </div>
        </div>
      </div>
    </>
  )
}
