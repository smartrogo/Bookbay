<div className="border-2 border-green-300 md:flex w-full hidden ">
<div className="flex w-full md:w-1/2 justify-evenly">
  {bookChunks.length > 0 ? (
      bookChunks[2].map((item, index) => (
        <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} year={item.first_publish_year} />
      ))
    ) : (
      <p>testing</p>
    )}
  </div>
  <div className="flex w-full md:w-1/2 justify-evenly">
  {bookChunks.length > 0 ? (
      bookChunks[3].map((item, index) => (
        <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} />
      ))
    ) : (
      <p>loading...</p>
    )}
  </div>
</div>