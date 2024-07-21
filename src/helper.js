import React from "react";

function helper() {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "'");
  };

  return { generateSlug };
}

export default helper;
