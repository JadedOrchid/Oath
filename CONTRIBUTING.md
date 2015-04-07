# Contributing

## Table of Contents

1. [General Workflow](#general-workflow)
1. [Detailed Workflow](#detailed-workflow)
    1. [Fork the repo](#fork-the-repo)
    1. [Be aware of your branch](#be-aware-of-your-branch)
    1. [Cut a namespaced branch](#cut-a-namespaced-branch-from-develop)
    1. [Make commits to your branch](#make-commits-to-your-branch)
    1. [Commit Message Guidelines](#commit-message-guidelines)
    1. [Rebase upstream changes into your branch](#rebase-upstream-changes-into-your-branch)
    1. [Make a pull request](#make-a-pull-request)
    1. [Guidelines](#guidelines)
1. [Workflow Summary](#workflow-summary)
1. [Checklist](#checklist)


Note: This project uses the many-branched git-workflow, it is recommended to add current git-branch to your command-line.
  If you use bash look [here](http://code-worrier.com/blog/git-branch-in-bash-prompt/).
  Command line examples will include the faux bash command line: (Current_Branch)$

## General Workflow

1. Fork the repo
1. Cut a namespaced branch from develop
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...

  e.g., "git checkout -b feat/linksView"

1. Make commits to your namespaced branch. Prefix each commit like so:
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
1. When you've finished with your fix or feature, Rebase upstream changes into your branch. submit a pull request
   directly to the branch you modified. Include a description of your changes.
1. Your pull request will be reviewed by another maintainer. The point of code
   reviews is to help keep the codebase clean and of high quality and, equally
   as important, to help you grow as a programmer. If your code reviewer
   requests you make a change you don't understand, ask them why.
1. Fix any issues raised by your code reviewer, and push your fixes as a single
   new commit.
1. Once the pull request has been reviewed, it will be merged by another member of the team. Do not merge your own commits.

## Detailed Workflow

### Fork the repo

Use github’s interface to make a personal fork of the Jaded Orchid repo. Clone your fork locally, this will be your working repo. Add the Jaded Orchid repo as an upstream remote of the local clone:

```
git remote add upstream https://github.com/<SOURCE_OF_REPO>/<NAME_OF_REPO>.git
```

### Be aware of your branch

For more information on the Git Workflow look [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) and [here](http://nvie.com/posts/a-successful-git-branching-model/).  In summary:

  - Jaded Orchid master is always in a deployable state.
  - Jaded Orchid develop branch is where most work will be merged into.
    - The work will be done off of the Jaded Orchid repo, on your local clone. 

### Cut a namespaced branch from develop

Your branch should follow this naming convention:
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...

These commands will help you do this:

``` bash

# Creates your branch and brings you there
(develop)$ git checkout -b `your-branch-name`
```

### Make commits to your branch. 

Prefix each commit like so
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...

Make changes and commits on your branch, and make sure that you
only make changes that are relevant to this branch. If you find
yourself making unrelated changes, make a new branch for those
changes.

A commit should be short, and include only *one logical change*.

#### Commit Message Guidelines

- Commit messages should be written in the present tense; e.g. "Fix continuous
  integration script".
- The first line of your commit message should be a brief summary of what the
  commit changes. Aim for about 70 characters max. Remember: This is a summary,
  not a detailed description of everything that changed.
- If you want to explain the commit in more depth, following the first line should
  be a blank line and then a more detailed description of the commit. This can be
  as detailed as you want, so dig into details here and keep the first line short.

[More information](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

### Rebase upstream changes into your branch

Once you are done making changes, you can begin the process of getting
your code merged into the main repo. Step 1 is to rebase upstream
changes to the master branch into yours by running this command
from your branch:

```bash
# Syntax                      FROM HERE:
(TO HERE)$ git pull --rebase (target repo) (target branch)
#e.g.,
(develop)$ git pull --rebase upstream develop
```
(This changes the commit history on your local repo to match the upstream repo.  This
will allow pull requests to merge automatically)

This will start the rebase process. You must commit all of your changes
before doing this. If there are no conflicts, this should just roll all
of your changes back on top of the changes from upstream, leading to a
nice, clean, linear commit history.

If there are conflicting changes, git will notify you part way
through the rebasing process. Git will pause rebasing to allow you to sort
out the conflicts. You do this the same way you solve merge conflicts,
by checking all of the files git says have been changed in both histories
and picking the versions you want. Be aware that these changes will show
up in your pull request, so try and incorporate upstream changes as much
as possible.

You pick a file by `git add`ing it - you do not make commits during a
rebase.

Once you are done fixing conflicts for a specific commit, run:

```bash
git rebase --continue
```

This will continue the rebasing process. Once you are done fixing all
conflicts you should run the existing tests to make sure you didn’t break
anything, then run your new tests (there are new tests, right?) and
make sure they work also.

If rebasing broke anything, fix it, then repeat the above process until
you get here again and nothing is broken and all the tests pass.

### Make a pull request

Make a clear pull request from your fork and branch to the related upstream
branch, detailing exactly what changes you made and what feature this
should add. The clearer your pull request is the faster you can get
your changes incorporated into this repo.

At least one other person MUST give your changes a code review, and once
they are satisfied they will merge your changes into upstream. Alternatively,
they may have some requested changes. You should make more commits to your
branch to fix these, then follow this process again from rebasing onwards.

Once you get back here, make a comment requesting further review and
someone will look at your code again. If they like it, it will get merged,
else, just repeat again.

Thanks for contributing!

### Guidelines

1. Uphold the current code standard:
    - Keep your code DRY
    - Apply the boy scout rule.
    - Follow [STYLE-GUIDE.md](STYLE-GUIDE.md)
1. Run the [tests][] before submitting a pull request.
1. Tests are very, very important. Submit tests if your pull request contains
   new, testable behavior.
1. Your pull request is comprised of a single ([squashed][]) commit.

## Workflow Summary:

Pull from upstream master often to limit how many merge conflicts you have to do, and 
pull from upstream before you prepare a personal pull request:

```bash
# Syntax                      FROM HERE:
(TO HERE)$ git pull --rebase (target repo) (target branch)
#e.g.,
(develop)$ git pull --rebase upstream develop
```

Next, resolve any merge conflicts, using:
```bash
git rebase --continue
```
to proceed through the conflicts.

Next, rebase your working branch onto the development branch:
```bash
#Syntax
(Working branch)$ git rebase (parent branch)

#e.g.,
(your feature branch)$ git rebase develop
#This will attach your feature to the develop branch, and implement it
```

Next, merge --no-ff to maintain a clean commit history, and logically group changes:
```bash
#Syntax:
(Parent Branch)$ git merge --no-ff (Rebased branch)

#e.g.,
(develop)$ git merge --no-ff feat/docView
```

Then push to your personal repo:
```bash
#Syntax:
(inconsequential)$ git push (target repo) (local branch to push)

#e.g.,
(any)$ git push origin develop
```

Finally, create a pull request.  Ensure that you are going from your repo's relevant branch to
the upstream repo's relevant branch.

## Checklist

This is just to help you organize your process

- [ ] Did I cut my work branch off of master (don't cut new branches from existing feature brances)?
- [ ] Did I follow the correct naming convention for my branch?
- [ ] Is my branch focused on a single main change?
 - [ ] Do all of my changes directly relate to this change?
- [ ] Did I rebase the upstream master branch after I finished all my
  work?
- [ ] Did I write a clear pull request message detailing what changes I made?
- [ ] Did I get a code review?
 - [ ] Did I make any requested changes from that code review?

If you follow all of these guidelines and make good changes, you should have
no problem getting your changes merged in.


<!-- Links -->
[style guide]: https://github.com/hackreactor-labs/style-guide
[n-queens]: https://github.com/hackreactor-labs/n-queens
[Underbar]: https://github.com/hackreactor-labs/underbar
[curriculum workflow diagram]: http://i.imgur.com/p0e4tQK.png
[cons of merge]: https://f.cloud.github.com/assets/1577682/1458274/1391ac28-435e-11e3-88b6-69c85029c978.png
[Bookstrap]: https://github.com/hackreactor/bookstrap
[Taser]: https://github.com/hackreactor/bookstrap
[tools workflow diagram]: http://i.imgur.com/kzlrDj7.png
[Git Flow]: http://nvie.com/posts/a-successful-git-branching-model/
[GitHub Flow]: http://scottchacon.com/2011/08/31/github-flow.html
[Squash]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html