https://www.philihp.com

## Write a post

- Create a branch
- Create a file inside of `_posts`, probably a markdown
- Write it
- Create a signature file with the command, and put it in the appropriate sigs dir:
```
gpg --armor --clearsign 2021-example.md
mv 2021-example.md.asc ../assets/sigs/
```
- Create a PR from branch, vercel should create a preview site.

## Create a redirect

See the `/vercel.json` file
