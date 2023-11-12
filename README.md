# CacheMate

CacheMate is a command line tool that can be used in conjunction with
optimization tools. It stores checksums of source files and checks for the
presence of their optimized versions to avoid unnecessary builds.

# How it works

1. CacheMate creates a JSON file to store checksums of source files.
2. When checking the cache, it compares the stored checksums of the source
   files with their current state.
3. If the checksum for a file remains the same and its corresponding minified
   version exists, the tool considers it properly cached.
4. CacheMate outputs the paths of properly cached files to a plain text file,
   which can easily be used by other tools.
