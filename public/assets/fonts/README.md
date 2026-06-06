OTF fonts here were downloaded directly from CTAN at https://ctan.org/pkg/cm-unicode?lang=en. Individual OTF fonts can be downloaded from https://ctan.org/tex-archive/fonts/cm-unicode/fonts/otf.

```
git clone --recursive https://github.com/google/woff2.git
cd woff2
make clean all
cp woff2_* /usr/local/sbin/
```

and then each was compressed with

```
for file in *.otf do
  woff2_compress $file
end
```

Would be cool to automate this, but I don't know if that would have much value.
