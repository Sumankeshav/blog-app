import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";
import baseURL from "../../../config/importantExport";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    fetch(`${baseURL}/feed/post/${postId}`)
      .then((res) => {
        // console.log({ res });
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        // console.log(resData);

        this.setState({
          title: resData.title,
          author: resData.creator.name,
          date: new Date(resData.createdAt._seconds * 1000).toLocaleDateString(
            "en-US"
          ),
          content: resData.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={"/src/images/sunset_image.webp"} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
