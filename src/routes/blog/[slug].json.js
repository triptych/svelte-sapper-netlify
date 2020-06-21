import path from "path";
import fs from "fs";
import grayMatter from "gray-matter";
import marked from "marked";
import { runInNewContext } from "vm";

const getPost = (fileName) => {
	return fs.readFileSync(
		path.resolve("static/posts/",`${fileName}.md`),
		"utf-8"
	);
};

export function get(req, res, _) {
	const {slug} = req.params;

	const post = getPost(slug);
	const renderer = new marked.Renderer();

	const {data, content} = grayMatter(post).data;
	const html = marked(content, {renderer});

	if(html){
		res.writeHead(200, {
			"Content-Type": "application/json"
		});

		res.end(JSON.stringify({html, ...data}));

	} else {
		res.writeHead(404, {
			"Content-Type": "application/json"
		});

		res.end(JSON.stringify({
			message: `Not Found`,
		}));
	}
}


// import posts from './_posts.js';

// const lookup = new Map();
// posts.forEach(post => {
// 	lookup.set(post.slug, JSON.stringify(post));
// });

// export function get(req, res, next) {
// 	// the `slug` parameter is available because
// 	// this file is called [slug].json.js
// 	const { slug } = req.params;

// 	if (lookup.has(slug)) {
// 		res.writeHead(200, {
// 			'Content-Type': 'application/json'
// 		});

// 		res.end(lookup.get(slug));
// 	} else {
// 		res.writeHead(404, {
// 			'Content-Type': 'application/json'
// 		});

// 		res.end(JSON.stringify({
// 			message: `Not found`
// 		}));
// 	}
// }
