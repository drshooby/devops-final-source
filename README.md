Devops Final Source Code Repo

# DevOps Final – Source Code Repo 🧪

## 🛠️ Build Strategy

1. Repo event triggers a `repository_dispatch` to the infra repo.
2. The infra repo checks if the ECR repositories exist:
   - If they don’t: it creates them.
   - If they do: it says “cool” and moves on.
3. Infra then bounces a `repository_dispatch` **back** to this repo saying: “we’re good.”
4. This repo then builds and pushes Docker images to ECR.

### ⚙️ Visual Flow

source-push ➔ infra-setup ➔ source-build ➔ deploy-happy
