# Forum

## Features

- Sign In

  Sign in with email and password. After signing in, you will be redirected to your profile page
  with your bio and timeline of post/comment.
  ![sign_in_and_user_profile](demo/sign_in_and_user_profile.gif)
  
- Search for user and follow this user
  
  Follow user and see their timeline in 'For You' tab in homepage 
  ![search_follow_user_and_for_you_tab](demo/search_follow_user_and_for_you_tab.gif)

- Make a post

  Make a post in markdown editor. When you type @,
  a list of user with the username prefix you type will pop up. Click to choose the user you want to mention.
  ![make_a_post](demo/make_a_post.gif)

- Make nested comments

  You can make any level of nested comments. Look similar to reddit? Yes, it is!
  ![make_nested_comments_like_reddit](demo/make_nested_comments_like_reddit.gif)

- Trie tree and search for a user in Messages

  When you type the username prefix, a list of users with that prefix will be shown for you to choose from. This is implemented with [Trie data structure](https://en.wikipedia.org/wiki/Trie)
  ![search_for_user_in_messenger](demo/search_for_user_in_messenger.gif)

- Start a new chat (realtime)

  User w search for user d and starts a new chat.
  The conversation appears on the chat pages of user w and user d in real time. This is implemented using the [Socket.io](https://socket.io/) framework.
  ![start_a_new_chat](demo/w_chat_with_d.gif)

- Chat history is saved

  Message history between a and w is saved.
  ![chat_record_saved](demo/chat_record_saved.gif)

- Tag page

  Search for tag page, click on the tag and all posts with the same tag are shown.
  ![tag_page](demo/tag_page.gif)

- Notification when someone starts following you
  User ddd receive a notification when user w starts following ddd.

  ![followed_notification](demo/followed_notification.gif)

- Notification when someone @you in a post

  User w mentioned user ddd in a post and user ddd received notificaiton. Feels like twitter?
  ![at_mention_notify](demo/at_mention_notify.gif)

- Load more posts when scrolling down

  ![more_posts_loaded_on_scroll](demo/more_posts_loaded_on_scroll.gif)

- Upvote a post to make it rank higher

  Posts are ranked based on time when it's posted and number of upvotes. More recent posts and posts with more upvotes are ranked higher.
  ![upvote_a_post_rank_higher](demo/upvote_a_post_rank_higher.gif)

- Share post or nested comments

  ![share_nest_comment](demo/share_nest_comment.gif)

- Bookmark any post or nested comments

  ![bookmark_any_post_or_comment](demo/bookmark_any_post_or_comment.gif)

- Browse history

  ![browse_history](demo/browse_history.gif)

# Run on your own computer
Clone the repository, in the /forum folder, run npm start in terminal, and the website is at localhost:5000 by default.