---
title: ML Roadmap
draft: true
description:
tags:
---
# 10-Month ML/AI Internship Roadmap

### Senior ML Engineer · Applied AI Tech Lead

**Target:** B.Tech CSE (2nd Year) → Internship-Ready ML/AI Engineer  
**Stack:** RTX 4060 · WSL2 Ubuntu 24.04 · PyTorch · HuggingFace · FastAPI · Docker  
**Constraint:** No Computer Vision. Pure NLP/Tabular/LLM track.

---

## Quick Stats

| Dimension      | Value                         |
| -------------- | ----------------------------- |
| Duration       | 52 Weeks (10–12 months)       |
| Phases         | 6 (0 → 5)                     |
| Topics Covered | 30+ with full template        |
| Projects       | 8 (Beginner → Production LLM) |
| CV Topics      | 0 (strictly excluded)         |

---

## Phase Timeline Overview

```
Weeks 1–2   │ Phase 0: Environment & Foundations (CUDA, WSL2, NumPy, Git)
Weeks 3–14  │ Phase 1: Classical ML (LinReg → LightGBM → Clustering → PCA)
Weeks 15–16 │ Phase 1.5: Deployment Basics (Streamlit + FastAPI)
Weeks 17–30 │ Phase 2: Deep Learning (Backprop → TinyTorch → PyTorch → RNNs)
Weeks 31–40 │ Phase 3: NLP & Transformers (Embeddings → Attention → BERT → GPT → Fine-tuning)
Weeks 41–48 │ Phase 4: Applied LLM Engineering (RAG → Agents → MLOps → Docker)
Weeks 49–52 │ Phase 5: Interview Prep & Portfolio Finalization
```

---

## Universal Daily Routine

> Apply across all 52 weeks. Adjust intensity per phase.

**Core Principle:** Weekdays = 4–5 hours active learning. Weekends = 6–8 hours project/review. Never skip the math block.

| Time Slot   | Activity                    | Details                                                                                                                                     |
| ----------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 6:00–7:30   | **Math & Theory**           | CS229 lecture or textbook derivations. Work every proof by hand. Derive every gradient and update rule yourself on paper — never just read. |
| 8:00–10:00  | **Coding Implementation**   | Implement the morning's theory in NumPy first, then PyTorch. Math-to-code translation must be exact. Write unit tests for every function.   |
| 16:00–17:30 | **Problem Sets**            | deep-ml.com problems + Kaggle tabular. LeetCode medium (Weeks 1–16), then ML system design (Week 17+).                                      |
| 20:00–21:00 | **Paper Reading + Writing** | Read one paper section (abstract + methods). Write one paragraph blog draft. Build in public from Week 4.                                   |
| Weekend AM  | **Project Sprint**          | 4–5 hours. Build, debug, deploy. Docs only — no tutorial following. Push to GitHub.                                                         |
| Weekend PM  | **Review & Consolidate**    | Rewrite week's derivations from memory. Update README. Record 5-min video walkthrough for LinkedIn. Mock interview from Week 20.            |

**Phase-Specific Time Splits:**

- **Phase 0–1:** 60% math / 30% code / 10% writing
- **Phase 2–3:** 40% math / 50% code / 10% writing
- **Phase 4–5:** 20% math / 50% project / 30% interview + portfolio

---

## PHASE 0: Environment & Foundations

### Weeks 1–2 · Zero tolerance for environment issues later

---

### CUDA 12.x / cuDNN Setup on WSL2 + RTX 4060

- **What:** CUDA is NVIDIA's parallel computing platform exposing GPU cores for GPGPU computation. cuDNN is a GPU-accelerated library of DNN primitives. On WSL2, NVIDIA provides a native CUDA driver passthrough — you do NOT install a Linux GPU driver inside WSL2; install the CUDA toolkit only.

- **Why:** Training even a small transformer on CPU is 50–200x slower than GPU. Your RTX 4060 has 3072 CUDA cores and 8GB VRAM — sufficient to fine-tune 7B parameter models with 4-bit quantization and train every model in this roadmap. Environment correctness is a prerequisite; a broken CUDA install wastes weeks.

- **How to Start:** Open Windows Terminal as Administrator. Run `wsl --update`. Then inside Ubuntu 24.04:

- **What Questions to Ask:**
  - What is the difference between the CUDA driver (Windows-side) and the CUDA toolkit (Linux/WSL-side)?
  - Why does WSL2 use a virtual GPU driver bridge, and what are the performance implications vs native Linux?
  - What is VRAM, and how does it constrain batch size and model size during training?
  - What is the difference between `torch.float32`, `torch.float16`, and `torch.bfloat16` in terms of VRAM usage and training stability?
  - **[Interview]** "Explain what happens computationally when you call `loss.backward()` — from CUDA kernel scheduling to gradient accumulation."

- **Standard Resources:**
  - **Blogs/Articles:** [NVIDIA WSL2 CUDA User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) · Search: "CUDA 12 WSL2 Ubuntu 24.04 setup 2024"
  - **Papers:** N/A
  - **Books:** N/A
  - **YouTube:** Search: "WSL2 CUDA deep learning setup 2024 NVIDIA" · Jeff Heaton: "Deep Learning GPU Setup WSL2"

- **How to Get Started Immediately:**

```bash
# Step 1: Verify WSL2 sees your GPU
nvidia-smi   # Should show RTX 4060 + CUDA version

# Step 2: Add CUDA 12.4 repo (do NOT install linux-headers in WSL)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update && sudo apt-get install cuda-toolkit-12-4

# Step 3: Set PATH
echo 'export PATH=/usr/local/cuda-12.4/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.4/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc

# Step 4: Install cuDNN 9.x
sudo apt-get install libcudnn9-cuda-12 libcudnn9-dev-cuda-12

# Step 5: Verify
nvcc --version
python3 -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

```python
# 5-minute GPU sanity check
import torch, time
print(f'CUDA: {torch.cuda.is_available()}, GPU: {torch.cuda.get_device_name(0)}')
print(f'VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB')

# Benchmark: GPU vs CPU matmul
x = torch.randn(4096, 4096)
t0 = time.time(); _ = x @ x; print(f'CPU: {time.time()-t0:.3f}s')
x = x.cuda()
t0 = time.time(); _ = x @ x; torch.cuda.synchronize()
print(f'GPU: {time.time()-t0:.3f}s')  # expect 30-100x speedup
```

- **Outcomes:**
  - _First Pass:_ `nvidia-smi` shows RTX 4060. `torch.cuda.is_available()` returns `True`. PyTorch 2.x installed in a venv.
  - _Second Pass:_ Benchmark confirms GPU 30–100x faster. Understand memory layout. Run small neural net training loop end-to-end on GPU.
  - _Third Pass:_ Profile with `torch.profiler`. Understand CUDA memory fragmentation. Know when to use `torch.compile()` and `torch.autocast` (AMP).

- **What I Can Learn From It & Resources to Generate:**
  - GitHub Gist: "RTX 4060 + WSL2 CUDA 12 Setup Script (2024 Edition)" — gets bookmarked by hundreds of developers
  - Blog: "Why nvidia-smi Shows CUDA But PyTorch Says False — And How to Fix It" — high SEO value
  - Benchmark table: CPU vs GPU speedup across matrix sizes 4×4 to 8192×8192

---

### WSL2 Production Dev Environment

- **What:** A reproducible Python development environment using `pyenv` (Python version management), `venv` (per-project isolation), and standard tooling: `black` (formatter), `ruff` (linter), `pytest` (testing), `jupyter` (experimentation). Goal: match production-grade ML team workflows from day one.

- **Why:** Dependency conflicts kill ML projects. Every production ML team uses isolated environments and strict version pinning. An interviewer evaluating your GitHub will instantly notice whether your project has a proper `requirements.txt` or `pyproject.toml`. This signals engineering discipline.

- **How to Start:** `curl https://pyenv.run | bash && pyenv install 3.11.9 && pyenv global 3.11.9`

- **What Questions to Ask:**
  - What is the difference between `venv`, `conda`, and `poetry` for dependency management?
  - Why should `requirements.txt` pin exact versions (`==`) for production?
  - **[Interview]** "How do you ensure reproducibility across team members' ML training runs?"

- **Standard Resources:**
  - **Blogs/Articles:** [pyenv GitHub](https://github.com/pyenv/pyenv) · Search: "Python ML project structure best practices 2024"
  - **Books:** N/A
  - **YouTube:** Search: "Python virtual environments ML projects"

- **How to Get Started Immediately:**

```bash
# Core ML stack install
python -m venv .venv && source .venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/cu124
pip install numpy pandas scikit-learn matplotlib seaborn jupyter
pip install black ruff pytest jupyterlab jupyterlab-nvdashboard
pip freeze > requirements.txt

# Project structure (use for every project)
ml-project/
├── data/           # raw/ processed/ — NEVER commit raw data
├── notebooks/      # exploration only
├── src/
│   ├── data.py     # dataset loaders
│   ├── model.py    # model definition
│   ├── train.py    # training loop
│   └── evaluate.py
├── tests/
├── .gitignore      # *.pth, *.ckpt, __pycache__, .venv
├── requirements.txt
├── README.md
└── Makefile        # make train, make test, make deploy
```

- **Outcomes:**
  - _First Pass:_ Clean venv, all packages installed, Jupyter running with GPU dashboard.
  - _Second Pass:_ Template repo on GitHub with Makefile targets and CI badge.
  - _Third Pass:_ Dockerize the environment — prerequisite for all deployment projects.

- **What I Can Learn From It & Resources to Generate:**
  - GitHub Template Repo: "ml-project-template" — reference in every future project
  - Blog: "The ML Dev Environment I Wish I Had on Day 1"

---

### NumPy & Pandas: Production-Grade Refresher

- **What:** NumPy provides N-dimensional array operations with C-speed execution via broadcasting and vectorization. Pandas provides DataFrame abstractions for tabular data. Focus on vectorized operations, memory layout, and broadcasting rules that cause bugs in ML code — not beginner tutorials.

- **Why:** All classical ML algorithms you'll implement from scratch use NumPy. The difference between a 3-second and 3-minute training loop is almost always vectorization. In ML interviews, you implement forward/backward passes in NumPy — if you reach for loops, you fail.

- **How to Start:** Complete rougier/numpy-100 exercises on GitHub.

- **What Questions to Ask:**
  - What is the difference between shape `(N,)`, `(N,1)`, and `(1,N)`? How does broadcasting handle each?
  - What does `np.einsum` do and when do you use it over explicit matmul?
  - What is the memory layout difference between C-contiguous and Fortran-contiguous arrays?
  - **[Interview]** "Implement batch matrix multiplication for `(B,N,D) × (B,D,M)` using NumPy without a loop."
  - **[Interview]** "Vectorize pairwise Euclidean distances between N points in D dimensions."

- **Standard Resources:**
  - **Blogs/Articles:** [NumPy Quickstart (official)](https://numpy.org/doc/stable/user/quickstart.html) · Search: "numpy broadcasting rules visual guide"
  - **Books:** "Python for Data Analysis" Wes McKinney — Ch. 4, 5, 10
  - **YouTube:** Search: "numpy broadcasting tutorial 3Blue1Brown"
  - **Problem Sets:** [deep-ml.com/problems](https://www.deep-ml.com/problems) Linear Algebra section · [rougier/numpy-100](https://github.com/rougier/numpy-100)

- **How to Get Started Immediately:**

```python
import numpy as np

# Critical broadcasting exercise — trace every shape
A = np.random.randn(100, 784)   # 100 samples, 784 features
w = np.random.randn(784, 10)    # weight matrix
b = np.random.randn(10)         # bias
logits = A @ w + b              # shape: (100,10) — how?

# Vectorized softmax (interview standard)
def softmax(x):
    x = x - x.max(axis=-1, keepdims=True)  # numerical stability
    e = np.exp(x)
    return e / e.sum(axis=-1, keepdims=True)

# Vectorized pairwise L2 distance (interview trick)
def pairwise_l2(X):  # X: (N, D)
    sq = (X**2).sum(axis=1, keepdims=True)  # (N,1)
    return np.sqrt(sq + sq.T - 2 * X @ X.T)  # broadcasting
```

- **Outcomes:**
  - _First Pass:_ Complete numpy-100. Implement softmax, sigmoid, cross-entropy with zero loops.
  - _Second Pass:_ Profile vectorized vs loop. Implement full feature engineering pipeline in Pandas.
  - _Third Pass:_ `numba` JIT for custom ops. Know when to hand off to PyTorch tensors.

- **What I Can Learn From It & Resources to Generate:**
  - GitHub Gist: "NumPy Broadcasting Cheatsheet with Visual Diagrams"
  - Blog: "Implementing Softmax in 1 Line (and Why the Naive Version Overflows)"
  - Derivation cheatsheet: "Vectorizing ML Operations — from loop to einsum"

---

### Git, GitHub & ML Project Engineering Practices

- **What:** Version control with Git + GitHub for ML projects: branching strategy, Conventional Commits, `.gitignore` for ML artifacts, Git LFS for model weights, GitHub Actions for CI (auto-lint + test on push).

- **Why:** Your GitHub profile IS your portfolio. Recruiters evaluate commit frequency, README quality, and project structure before reading your resume. A proper `requirements.txt`, README, and CI badge signals an engineer, not a student.

- **How to Start:** Initialize the `ml-project-template` repo from Phase 0 with a GitHub Actions workflow.

- **What Questions to Ask:**
  - How do you version ML datasets and model artifacts? (DVC, Git LFS, S3)
  - **[Interview]** "How do you ensure your ML experiment is reproducible by a teammate 6 months later?"
  - What should and should NOT be committed in an ML repository?

- **Standard Resources:**
  - **Blogs/Articles:** [GitHub Actions docs](https://docs.github.com/en/actions) · [Cookiecutter Data Science](https://github.com/drivendata/cookiecutter-data-science)
  - **Books:** N/A
  - **YouTube:** Search: "GitHub Actions Python ML CI pipeline tutorial"

- **How to Get Started Immediately:**

```bash
# Commit convention (non-negotiable habit)
git commit -m "feat: add attention mechanism to transformer block"
git commit -m "fix: gradient clipping for LSTM instability"
git commit -m "docs: add derivation section to README"
git commit -m "perf: vectorize pairwise distance computation"

# .github/workflows/ci.yml — auto-lint + test on every push
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with: {python-version: '3.11'}
      - run: pip install -r requirements.txt
      - run: ruff check src/
      - run: pytest tests/ -v
```

- **Outcomes:**
  - _First Pass:_ Template repo on GitHub with proper structure and green CI badge.
  - _Second Pass:_ Add pre-commit hooks (black, ruff). Pin dependencies with `pip-compile`.
  - _Third Pass:_ Full CD pipeline: lint → test → build Docker → push DockerHub.

- **What I Can Learn From It & Resources to Generate:**
  - Public GitHub Template: "ml-project-template" — link in every project
  - Blog: "My ML Project GitHub Structure (And Why It Gets Interviews)"

---

## PHASE 1: Classical Machine Learning

### Weeks 3–14 · CS229 aligned · Mathematical derivations required

---

### Linear Regression: MLE, OLS, Gradient Descent

_Phase 1 · Weeks 3–4 · CS229 Lec 1–2_

- **What:** Models conditional expectation **E[y|x] = θᵀx** under Gaussian noise assumption. Cost: J(θ) = (1/2m)‖Xθ − y‖². Three solution methods: (1) Normal Equations θ = (XᵀX)⁻¹Xᵀy — O(n³), (2) Batch Gradient Descent — O(mn) per epoch, (3) Stochastic/Mini-batch GD — scalable. Probabilistic interpretation: maximizing Gaussian likelihood = minimizing MSE.

- **Why:** The foundation of every ML model's loss landscape intuition. Linear regression's geometry (convex bowl, global minimum, condition number of XᵀX) gives intuition for why deep networks are harder. Used directly in production: pricing, demand forecasting, baseline in every tabular pipeline.

- **How to Start:** Derive the Normal Equations by setting ∇θJ(θ) = 0. Work through every matrix dimension manually.

- **What Questions to Ask:**
  - Derive the Normal Equations from ∇θJ = 0. Show every matrix dimension step.
  - Why is (XᵀX) not always invertible? What does multicollinearity cause geometrically?
  - Derive MSE from maximum likelihood of the Gaussian model: p(y|x;θ) = N(θᵀx, σ²).
  - Derive the condition for gradient descent convergence using the Lipschitz constant of ∇J.
  - What is the computational complexity of Normal Equations vs GD? When do you use each?
  - **[Interview]** "Your linear regression has R²=0.95 train but 0.60 test. Give 5 possible causes and remediation plan."
  - **[Interview]** "How would you implement linear regression on a 10M-row dataset that doesn't fit in RAM?"
  - What is locally weighted linear regression and when is it preferred?

- **Standard Resources:**
  - **Blogs/Articles:** CS229 Lecture Notes 1 (Andrew Ng) — read alongside Lec 1–2 · Search: "probabilistic interpretation linear regression"
  - **Papers:** N/A
  - **Books:** "Elements of Statistical Learning" (ESL) Ch. 3.1–3.4 · Bishop PRML Ch. 3
  - **YouTube:** CS229 Autumn 2018 Lec 1–2 (YouTube: "Stanford CS229 Machine Learning Andrew Ng 2018")
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Linear Regression Using Normal Equation", "Linear Regression Using Gradient Descent" · CS229 Problem Set 1

- **How to Get Started Immediately:**

```python
import numpy as np

class LinearRegression:
    def __init__(self, lr=0.01, epochs=1000):
        self.lr, self.epochs = lr, epochs

    def fit(self, X, y):
        m, n = X.shape
        X_b = np.c_[np.ones((m, 1)), X]  # add bias column
        self.theta = np.zeros(n + 1)
        for _ in range(self.epochs):
            y_hat = X_b @ self.theta
            grad = (1/m) * X_b.T @ (y_hat - y)  # ∇J = (1/m)Xᵀ(Xθ−y)
            self.theta -= self.lr * grad

    def normal_equation(self, X, y):
        # θ = (XᵀX)⁻¹Xᵀy — O(n³), use only for small n
        X_b = np.c_[np.ones((X.shape[0], 1)), X]
        self.theta = np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y

    def predict(self, X):
        return np.c_[np.ones((X.shape[0], 1)), X] @ self.theta

# Sanity check
X = np.random.randn(200, 3)
true_theta = np.array([2.0, -1.5, 3.0])
y = X @ true_theta + np.random.randn(200) * 0.1

model = LinearRegression(lr=0.05, epochs=2000)
model.fit(X, y)
print("GD theta:", model.theta[1:])  # should be ~[2, -1.5, 3]
model.normal_equation(X, y)
print("NE theta:", model.theta[1:])  # exact same
```

- **Outcomes:**
  - _First Pass:_ Implement GD + Normal Equations. Verify against sklearn. MSE identical.
  - _Second Pass:_ Add LR scheduling (step decay). Implement SGD and mini-batch GD. Plot convergence. Verify gradient numerically with finite differences.
  - _Third Pass:_ Handle multicollinearity via Ridge. Implement locally weighted LR. Deploy house price predictor via Streamlit.

- **What I Can Learn From It & Resources to Generate:**
  - GitHub Gist: "Linear Regression from Scratch: Normal Equations, GD, Mini-batch GD with convergence plots"
  - Blog: "The Probabilistic Derivation of Linear Regression — Why MLE = MSE under Gaussian Noise"
  - Derivation cheatsheet: "Normal Equations — step-by-step matrix calculus"

---

### Logistic Regression: MLE, Cross-Entropy, Sigmoid

_Phase 1 · Weeks 3–4 · CS229 Lec 3–5_

- **What:** Models P(y=1|x;θ) = σ(θᵀx) where σ(z) = 1/(1+e⁻ᶻ). Loss is Binary Cross-Entropy (BCE): L = −(1/m)Σ[yᵢlog(ŷᵢ) + (1−yᵢ)log(1−ŷᵢ)], derived from maximizing Bernoulli log-likelihood. Decision boundary θᵀx = 0 is a hyperplane. Despite its name, it is a classification model.

- **Why:** Dominant baseline in industry for binary classification (credit scoring, churn, fraud). Probability outputs are calibrated and interpretable. The gradient ∂L/∂θ = (1/m)Xᵀ(ŷ−y) is identical in form to linear regression — this pattern recurs at every neural network output layer.

- **How to Start:** Derive the BCE gradient from scratch. Show every step from sigmoid through chain rule.

- **What Questions to Ask:**
  - Derive ∂L/∂θ for BCE loss. Show every step.
  - Why can't you use MSE as loss for logistic regression? (non-convex)
  - What is the log-odds interpretation of logistic regression coefficients?
  - How does multinomial (softmax) logistic regression generalize binary LR?
  - **[Interview]** "Your LR model gives P(fraud)=0.03 for a true fraud case. How do you handle class imbalance and choose threshold?"
  - **[Interview]** "Prove that logistic regression's decision boundary is linear even though the output is non-linear."
  - What is the relationship between logistic regression and Naive Bayes under Gaussian assumptions?

- **Standard Resources:**
  - **Blogs/Articles:** CS229 Lecture Notes 1 (Classification, GDA section) · Search: "logistic regression calibration Platt scaling"
  - **Papers:** N/A
  - **Books:** ESL Ch. 4.4
  - **YouTube:** CS229 Autumn 2018 Lec 3–5
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Logistic Regression", "Sigmoid Function", "Binary Cross-Entropy Loss" · Kaggle: "Titanic" (logistic baseline)

- **How to Get Started Immediately:**

```python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

class LogisticRegression:
    def __init__(self, lr=0.1, epochs=1000):
        self.lr, self.epochs = lr, epochs

    def fit(self, X, y):
        m, n = X.shape
        X_b = np.c_[np.ones((m, 1)), X]
        self.theta = np.zeros(n + 1)
        for _ in range(self.epochs):
            y_hat = sigmoid(X_b @ self.theta)
            # Gradient of BCE: ∇L = (1/m)Xᵀ(ŷ − y)
            grad = (1/m) * X_b.T @ (y_hat - y)
            self.theta -= self.lr * grad

    def predict_proba(self, X):
        return sigmoid(np.c_[np.ones((X.shape[0], 1)), X] @ self.theta)

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)
```

- **Outcomes:**
  - _First Pass:_ NumPy implementation matches sklearn on Titanic. Plot decision boundary on 2D data.
  - _Second Pass:_ Implement multinomial (softmax) LR. Add L2 regularization. Verify gradient with finite differences.
  - _Third Pass:_ Handle class imbalance. Calibrate with Platt scaling. Wrap in FastAPI endpoint.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Deriving Logistic Regression: Bernoulli MLE to BCE Gradient in 6 Steps"
  - GitHub: Titanic classifier comparison — LogReg vs sklearn in polished README table
  - Cheatsheet: "BCE Gradient Derivation — 6 steps"

---

### Regularization: L1/L2/ElasticNet, Bayesian Interpretation

_Phase 1 · Weeks 5–6_

- **What:** Adds penalty to loss to constrain model complexity. **L2 (Ridge):** J_ridge = J + λ‖θ‖₂² — shrinks all weights, never to zero. Bayesian: Gaussian prior. Closed form: θ_ridge = (XᵀX + λI)⁻¹Xᵀy. **L1 (Lasso):** J_lasso = J + λ‖θ‖₁ — promotes sparsity via non-differentiable corner at origin. Bayesian: Laplace prior. **ElasticNet:** linear combination of L1 + L2.

- **Why:** Used in every production ML model. L1 sparsity is critical in high-dimensional settings (genomics, NLP feature bags). L2 = weight decay in neural networks. Understanding regularization is prerequisite for understanding dropout, batch normalization, and BERT's pretraining stability.

- **How to Start:** Derive the Ridge closed-form and prove λI ensures invertibility.

- **What Questions to Ask:**
  - Derive θ_ridge = (XᵀX + λI)⁻¹Xᵀy. Why does λI always make XᵀX invertible?
  - Why does L1 produce sparse solutions while L2 does not? Geometric constraint region argument.
  - How do you choose λ? Cross-validated grid search vs GCV.
  - What is the MAP estimation connection between L2 regularization and Gaussian prior?
  - **[Interview]** "You train a linear model with 10,000 features. After Lasso, 9,800 weights are zero. Is this a problem? Diagnose."
  - **[Interview]** "Explain the bias-variance decomposition of regularization parameter λ."

- **Standard Resources:**
  - **Blogs/Articles:** Search: "L1 vs L2 regularization geometric intuition" · Search: "coordinate descent Lasso implementation"
  - **Papers:** N/A
  - **Books:** ESL Ch. 3.4 (Ridge), Ch. 3.6 (Lasso) · Géron "Hands-On ML" Ch. 4
  - **YouTube:** CS229 Autumn 2018 Lec 6–8
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Ridge Regression", "Lasso Regression" · Kaggle: House Prices (Advanced)

- **How to Get Started Immediately:**

```python
import numpy as np

class RidgeRegression:
    def fit(self, X, y, lam=1.0):
        X_b = np.c_[np.ones((X.shape[0], 1)), X]
        n = X_b.shape[1]
        I = np.eye(n); I[0, 0] = 0  # don't regularize bias
        # θ = (XᵀX + λI)⁻¹Xᵀy — always invertible if λ>0
        self.theta = np.linalg.inv(X_b.T @ X_b + lam * I) @ X_b.T @ y

# Compare effect of λ on weight magnitude
X = np.random.randn(50, 100)  # underdetermined (n > m)
y = np.random.randn(50)
for lam in [0.001, 1.0, 100.0]:
    m = RidgeRegression(); m.fit(X, y, lam)
    print(f"λ={lam}: max|θ|={np.abs(m.theta).max():.4f}")
```

- **Outcomes:**
  - _First Pass:_ Ridge closed-form. Use sklearn Ridge, Lasso, ElasticNet. Plot regularization path.
  - _Second Pass:_ Implement coordinate descent for Lasso. Cross-validate λ. Derive MAP estimation from scratch.
  - _Third Pass:_ Compare L1 sparsity on high-dimensional data. ElasticNet with cross-validated (α, λ) grid. Deploy as feature selection API.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "L1 vs L2 — The Geometric Intuition That Finally Made It Click"
  - Cheatsheet: "Regularization ↔ Bayesian Priors — one-page derivation"

---

### Bias-Variance Tradeoff & Cross-Validation

_Phase 1 · Weeks 5–6 · CS229 Lec 6_

- **What:** Expected test error decomposes: E[(y−ŷ)²] = Bias²[ŷ] + Var[ŷ] + σ²_noise. **Bias** = systematic error from model assumptions. **Variance** = sensitivity to training data. **Noise** σ² = irreducible. Cross-validation (k-fold, stratified, LOOCV) provides unbiased test error estimation for model selection.

- **Why:** Every ML engineering decision — model complexity, regularization strength, ensemble size — is fundamentally a bias-variance tradeoff. The learning curve (training size vs. train/val error) is the single most important diagnostic plot. In interviews, "my model overfits" must be accompanied by the decomposition and specific remediation.

- **How to Start:** Derive the bias-variance decomposition mathematically starting from E[(y − ŷ)²].

- **What Questions to Ask:**
  - Derive the bias-variance decomposition. What assumption about noise is needed?
  - Why does increasing model complexity reduce bias but potentially increase variance?
  - What is the difference between k-fold CV and LOOCV in terms of bias and variance of the error estimate?
  - How does bagging specifically reduce variance without increasing bias?
  - **[Interview]** "Your validation loss is much higher than training loss. Walk through your diagnostic process step by step."
  - **[Interview]** "How many folds for k-fold CV? Justify statistically."
  - What is the double descent phenomenon, and how does it challenge classical bias-variance?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "bias variance tradeoff double descent Belkin 2019"
  - **Papers:** Belkin et al. (2019) "Reconciling Modern Machine Learning Practice and the Classical Bias-Variance Trade-Off"
  - **Books:** ESL Ch. 7 (Model Assessment and Selection) — definitive reference
  - **YouTube:** CS229 Lec 6 · StatQuest: "Bias and Variance"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "K-Fold Cross-Validation", "Cross Validation Data Split" · Implement learning curves on any Kaggle dataset

- **How to Get Started Immediately:**

```python
import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.linear_model import Ridge
import matplotlib.pyplot as plt

def plot_learning_curve(model, X, y):
    sizes = np.linspace(0.1, 1.0, 10)
    train_sz, train_sc, val_sc = learning_curve(
        model, X, y, train_sizes=sizes, cv=5,
        scoring='neg_mean_squared_error'
    )
    plt.plot(train_sz, -train_sc.mean(1), label='Train MSE')
    plt.plot(train_sz, -val_sc.mean(1), label='Val MSE')
    plt.legend(); plt.xlabel('Training samples'); plt.show()
    # High train MSE → high bias. Large gap → high variance.
```

- **Outcomes:**
  - _First Pass:_ Generate learning curves for polynomial regression. Visually identify under/overfitting.
  - _Second Pass:_ Implement k-fold CV from scratch. Verify against sklearn. Derive LOOCV formula for linear models analytically.
  - _Third Pass:_ Implement nested cross-validation for hyperparameter tuning. Understand double descent empirically.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "The One Plot Every ML Engineer Should Know — Learning Curves Explained"
  - Cheatsheet: "Bias-Variance Decomposition Derivation + Debugging Flowchart"

---

### Support Vector Machines & Kernel Methods

_Phase 1 · Weeks 7–8 · CS229 Lec 9–10_

- **What:** SVMs find the maximum-margin hyperplane: maximize 2/‖w‖ subject to yᵢ(wᵀxᵢ+b) ≥ 1. Lagrangian dual: maximize Σαᵢ − (1/2)ΣᵢΣⱼαᵢαⱼyᵢyⱼxᵢᵀxⱼ subject to αᵢ ≥ 0 and Σαᵢyᵢ = 0. The kernel trick substitutes K(xᵢ,xⱼ) = φ(xᵢ)ᵀφ(xⱼ) allowing implicit high-dimensional feature mapping. Soft-margin (C-SVM) allows slack variables ξᵢ.

- **Why:** SVMs dominate in structured prediction with limited data and engineered features. The kernel trick (Mercer's theorem) is conceptually foundational — it appears in Gaussian Processes and is conceptually related to attention. The Lagrangian duality derivation (KKT conditions) is standard in ML PhD/research interviews.

- **How to Start:** Derive the SVM dual from the primal Lagrangian. Work through every KKT condition.

- **What Questions to Ask:**
  - Derive the SVM dual from the primal. What does strong duality (Slater's condition) guarantee?
  - What are KKT conditions and how do they imply only support vectors have non-zero αᵢ?
  - What makes a function a valid kernel? State Mercer's theorem informally.
  - What is the relationship between the RBF kernel bandwidth γ and bias-variance?
  - How does C control the soft-margin SVM? What is the geometric meaning of C → ∞?
  - **[Interview]** "When would you use an SVM over XGBoost on a tabular dataset?"
  - **[Interview]** "How does the kernel trick avoid the curse of dimensionality?"

- **Standard Resources:**
  - **Blogs/Articles:** Search: "SVM dual derivation KKT conditions visual" · CS229 Lecture Notes 3
  - **Papers:** Cortes & Vapnik (1995) "Support-Vector Networks" · Platt (1998) "Fast Training of SVMs using Sequential Minimal Optimization"
  - **Books:** ESL Ch. 12 — authoritative
  - **YouTube:** CS229 Autumn 2018 Lec 9–10
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Support Vector Machine Training" · CS229 Problem Set 3

- **How to Get Started Immediately:**

```python
from sklearn.svm import SVC
from sklearn.datasets import make_circles

X, y = make_circles(n_samples=300, noise=0.1, random_state=42)

# Linear SVM (will fail on circles — non-linear boundary)
svm_lin = SVC(kernel='linear', C=1.0)
svm_lin.fit(X, y)
print(f"Linear SVM accuracy: {svm_lin.score(X, y):.3f}")

# RBF kernel (implicit infinite-dimensional feature map)
svm_rbf = SVC(kernel='rbf', C=1.0, gamma=1.0)
svm_rbf.fit(X, y)
print(f"RBF SVM accuracy:    {svm_rbf.score(X, y):.3f}")
print(f"Support vectors:     {svm_rbf.n_support_}")
```

- **Outcomes:**
  - _First Pass:_ Use sklearn SVC. Compare linear, poly, RBF on toy datasets. Visualize decision boundaries.
  - _Second Pass:_ Implement a simplified SVM via SMO (Platt 1998). Implement RBF kernel as NumPy function.
  - _Third Pass:_ Apply to text classification with TF-IDF features. Compare vs Logistic Regression. Discuss kernel choice.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "SVM Dual Derivation: From Primal QP to Kernel Trick in 8 Steps"
  - GitHub: SVM decision boundary visualizer (Streamlit) — interactive C and γ adjustment

---

### Decision Trees: Gini Impurity, Information Gain, CART

_Phase 1 · Weeks 9–10_

- **What:** Recursive partitioning of feature space using axis-aligned splits. CART algorithm: at each node, find feature j and threshold t minimizing a purity criterion. **Gini:** G = Σₖ pₖ(1−pₖ) = 1 − Σₖpₖ². **Entropy:** H = −Σₖ pₖ log pₖ. **Information Gain:** IG = H(parent) − Σ(|child|/|parent|)·H(child). **Regression:** minimize MSE reduction. Tree depth is the primary regularization knob.

- **Why:** Decision trees are the atomic unit of every state-of-the-art tabular ML model (Random Forest, XGBoost, LightGBM). Understanding trees from scratch is prerequisite for understanding why gradient boosting works, how to tune depth vs learning rate, and how feature importances are computed.

- **How to Start:** Implement Gini impurity and find_best_split in NumPy.

- **What Questions to Ask:**
  - Derive Gini impurity: show G = 1 − Σpₖ². Why is it computationally preferred over entropy?
  - What is the computational complexity of finding the optimal split at one node?
  - Why do decision trees overfit? Relationship between max_depth and variance?
  - How does CART handle missing values?
  - **[Interview]** "Implement a decision stump (depth-1 tree) from scratch in NumPy."
  - **[Interview]** "A decision tree trained on 10,000 samples has 0% training error. What happened and how do you fix it?"

- **Standard Resources:**
  - **Blogs/Articles:** Search: "CART algorithm implementation from scratch Python"
  - **Papers:** Breiman et al. (1984) "Classification and Regression Trees" — the original CART book
  - **Books:** ESL Ch. 9.2 · Géron "Hands-On ML" Ch. 6
  - **YouTube:** StatQuest: "Decision Trees" series (complete)
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Decision Tree Learning", "Calculate Information Gain", "Calculate Gini Impurity"

- **How to Get Started Immediately:**

```python
import numpy as np

def gini(y):
    classes, counts = np.unique(y, return_counts=True)
    p = counts / len(y)
    return 1 - (p**2).sum()  # G = 1 - Σpₖ²

def best_split(X, y):
    best_gain, best_feat, best_thresh = -np.inf, None, None
    G_parent = gini(y); N = len(y)
    for feat in range(X.shape[1]):
        for t in np.unique(X[:, feat]):
            left = y[X[:, feat] <= t]
            right = y[X[:, feat] > t]
            if len(left) == 0 or len(right) == 0: continue
            gain = G_parent - (len(left)/N)*gini(left) - (len(right)/N)*gini(right)
            if gain > best_gain:
                best_gain, best_feat, best_thresh = gain, feat, t
    return best_feat, best_thresh, best_gain

# Test on XOR
X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([0,1,1,0])
print(best_split(X, y))
```

- **Outcomes:**
  - _First Pass:_ Implement decision stump. sklearn DecisionTreeClassifier on Titanic. Visualize tree via graphviz.
  - _Second Pass:_ Full recursive CART tree with max_depth, min_samples_split. Verify against sklearn.
  - _Third Pass:_ Add cost-complexity pruning (CCP). Implement impurity-based feature importances. Deploy tree visualizer as Streamlit app.

- **What I Can Learn From It & Resources to Generate:**
  - GitHub: "Decision Tree from Scratch — full CART with Streamlit visualizer"
  - Blog: "Why Does Gini Impurity Work? A First-Principles Derivation"

---

### Random Forests: Bagging, Feature Subsampling, OOB

_Phase 1 · Weeks 9–10_

- **What:** Combines B decision trees via Bootstrap Aggregation. Each tree: trained on bootstrap sample of size N (with replacement), at each split only random √D features considered. Final prediction: majority vote or average. **OOB error:** ~37% of samples not selected per bootstrap → free cross-validation.

- **Why:** Strongest out-of-the-box model for tabular ML. Robust to hyperparameters, handles missing values, provides calibrated feature importances, scales to millions of samples. Mandatory baseline at every ML internship before boosting models.

- **How to Start:** Implement bagging using your CART tree from scratch. Verify OOB error = ~36.8% left out.

- **What Questions to Ask:**
  - Show mathematically how bagging reduces variance without changing bias.
  - Why does feature subsampling decorrelate trees? What is the effect on ensemble variance?
  - How is OOB error computed? Prove ~36.8% of samples are OOB per tree.
  - What is permutation feature importance vs impurity-based importance?
  - **[Interview]** "Random Forest vs XGBoost on a 1M row dataset — how do you choose?"
  - **[Interview]** "Explain the relationship between number of trees B, tree depth, and bias-variance in Random Forest."

- **Standard Resources:**
  - **Blogs/Articles:** Search: "Random Forest OOB error derivation" · sklearn Random Forest docs
  - **Papers:** Breiman (2001) "Random Forests" — _Machine Learning_ — the original paper
  - **Books:** ESL Ch. 15 · Géron "Hands-On ML" Ch. 7
  - **YouTube:** StatQuest: "Random Forest" series
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Random Forest Classifier" · Kaggle: "Predict Future Sales" — RF baseline

- **How to Get Started Immediately:**

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier

class RandomForest:
    def __init__(self, n_trees=100, max_depth=None, max_features='sqrt'):
        self.n_trees, self.max_depth = n_trees, max_depth
        self.max_features = max_features
        self.trees = []

    def fit(self, X, y):
        n, d = X.shape
        max_f = int(np.sqrt(d)) if self.max_features == 'sqrt' else d
        for _ in range(self.n_trees):
            idx = np.random.choice(n, n, replace=True)  # bootstrap
            feat_idx = np.random.choice(d, max_f, replace=False)
            tree = DecisionTreeClassifier(max_depth=self.max_depth)
            tree.fit(X[idx][:, feat_idx], y[idx])
            self.trees.append((tree, feat_idx))

    def predict(self, X):
        votes = np.array([t.predict(X[:, fi]) for t, fi in self.trees])
        return np.apply_along_axis(
            lambda x: np.bincount(x.astype(int)).argmax(), 0, votes)
```

- **Outcomes:**
  - _First Pass:_ sklearn RF on Titanic. Tune n_estimators, max_depth, max_features. Plot OOB error vs n_estimators.
  - _Second Pass:_ Implement bagging from scratch with your CART tree. Add permutation importance.
  - _Third Pass:_ Apply to real Kaggle competition. Compare sklearn RF vs LightGBM. Deploy feature importance Streamlit dashboard.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Building Random Forest from Scratch: Bagging + Feature Subsampling + OOB Error"
  - GitHub: Mini-RF with Streamlit feature importance dashboard

---

### Gradient Boosting Machines: AdaBoost → GBDT → XGBoost → LightGBM

\*Phase 1 · Weeks 11–12 · **Highest Industry ROI\***

- **What:** Builds additive ensemble F_M(x) = Σₘ γₘhₘ(x) by fitting each weak learner to the **negative gradient of the loss** — functional gradient descent. **AdaBoost:** exponential loss, reweights samples. **GBDT (Friedman 2001):** any differentiable loss. **XGBoost:** second-order Taylor expansion, L1/L2 tree regularization, column subsampling. Optimal leaf weight: **w_j\* = −G_j / (H_j + λ)** where G_j = Σgᵢ, H_j = Σhᵢ. **LightGBM:** leaf-wise growth + histogram binning → 10–100x speedup. **CatBoost:** ordered boosting for categoricals.

- **Why:** XGBoost/LightGBM wins 60–80% of Kaggle tabular competitions. In production: every fraud detection, search ranking, and CTR prediction system at FAANG uses gradient boosting. An ML intern who can tune LightGBM, engineer features, and interpret SHAP values is immediately productive on day one.

- **How to Start:** Read Friedman (2001). Implement gradient boosting from scratch using your CART tree on MSE loss (pseudo-residuals = actual residuals as a special case).

- **What Questions to Ask:**
  - Derive the GBDT update step. Show that fitting trees to residuals (MSE) is a special case.
  - Write XGBoost objective: L⁽ᵗ⁾ = Σl(yᵢ, ŷᵢ⁽ᵗ⁾) + Ω(fₜ). Derive second-order Taylor expansion.
  - Derive optimal leaf weight w_j\* = −G_j / (H_j + λ) by setting ∂L/∂w_j = 0.
  - What is the gain formula for a split in XGBoost? What do λ (L2) and γ (min gain) control?
  - Why is LightGBM's leaf-wise growth faster but riskier? What prevents overfitting?
  - What is SHAP and how does it unify feature importance?
  - **[Interview]** "A LightGBM model has AUC=0.91 on validation but 0.68 on 2 weeks of live traffic. Diagnose and propose fixes."
  - **[Interview]** "How do you handle a feature with 500 unique categorical values in LightGBM?"

- **Standard Resources:**
  - **Blogs/Articles:** XGBoost docs: "Understanding XGBoost Model" tutorial · Search: "SHAP values explanation Lundberg"
  - **Papers:** Friedman (2001) "Greedy Function Approximation: A Gradient Boosting Machine" · Chen & Guestrin (2016) "XGBoost: A Scalable Tree Boosting System" (KDD Best Paper) · Ke et al. (2017) "LightGBM" (NeurIPS) · Lundberg (2017) "A Unified Approach to Interpreting Model Predictions" — SHAP
  - **Books:** ESL Ch. 10 (Boosting and Additive Trees)
  - **YouTube:** StatQuest: "XGBoost" series · Search: "LightGBM vs XGBoost tabular 2024"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Gradient Boosting Regression" · Kaggle: "Porto Seguro Safe Driver Prediction" · Kaggle: "House Prices Advanced"

- **How to Get Started Immediately:**

```python
import lightgbm as lgb
import xgboost as xgb
import shap
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_val, y_tr, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# LightGBM — production-standard hyperparams
params = {
    'objective': 'binary', 'metric': 'auc',
    'num_leaves': 31, 'learning_rate': 0.05,
    'feature_fraction': 0.8, 'bagging_fraction': 0.8,
    'min_child_samples': 20, 'verbose': -1
}
dtrain = lgb.Dataset(X_tr, label=y_tr)
dval   = lgb.Dataset(X_val, label=y_val, reference=dtrain)
model  = lgb.train(params, dtrain, num_boost_round=1000,
                   valid_sets=[dval],
                   callbacks=[lgb.early_stopping(50), lgb.log_evaluation(100)])

# SHAP — required for any production deployment
explainer  = shap.TreeExplainer(model)
shap_vals  = explainer.shap_values(X_val)
shap.summary_plot(shap_vals[1], X_val, feature_names=load_breast_cancer().feature_names)
```

> **Key Math:** XGBoost Gain = (1/2)[G_L²/(H_L+λ) + G_R²/(H_R+λ) − (G_L+G_R)²/(H_L+H_R+λ)] − γ

- **Outcomes:**
  - _First Pass:_ Working LightGBM + XGBoost pipelines. SHAP summary plots. Top 20% on a Kaggle tabular comp.
  - _Second Pass:_ Implement GBDT from scratch with CART tree. Verify on MSE loss. Early stopping manually.
  - _Third Pass:_ Optuna hyperparameter tuning. Feature engineering pipeline (target encoding, interactions). FastAPI endpoint with SHAP explanations in response.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "XGBoost Optimal Leaf Weight: The Math Behind the Most Powerful Tree Model"
  - GitHub: "Gradient Boosting from Scratch — AdaBoost to GBDT in pure NumPy"
  - Kaggle Notebook: "LightGBM + Optuna + SHAP — Complete Production Pipeline" — aim for gold medal
  - Streamlit App: "ML Explainability Dashboard — SHAP force + waterfall plots"

---

### Clustering: K-Means, DBSCAN, Gaussian Mixture Models

_Phase 1 · Weeks 13–14 · CS229 Lec 13_

- **What:** **K-Means (Lloyd's):** minimize J = ΣₖΣᵢ∈Cₖ ‖xᵢ−μₖ‖². E-step: assign to nearest centroid. M-step: update centroids. Converges monotonically, finds local minimum. **DBSCAN:** density-based — core points (≥MinPts in ε-ball), border, noise. No k required. **GMM (EM):** soft assignments via posterior P(zₖ|xᵢ) ∝ πₖN(xᵢ;μₖ,Σₖ). E-step: compute responsibilities. M-step: update πₖ, μₖ, Σₖ. K-Means = special case of GMM (isotropic equal covariance).

- **Why:** Clustering underpins customer segmentation, anomaly detection, document clustering. The EM algorithm framework extends to HMMs, LDA, and is the conceptual ancestor of the ELBO in VAEs. GMMs + EM is mandatory in ML PhD interviews.

- **How to Start:** Implement K-Means++ initialization and the full EM update loop for GMM.

- **What Questions to Ask:**
  - Prove K-Means objective J monotonically decreases at each step.
  - Derive the EM algorithm for GMMs. What is the ELBO being maximized?
  - What is K-Means++ initialization and its O(log K) approximation guarantee?
  - How do you choose K? Elbow method, Silhouette score, BIC criterion.
  - **[Interview]** "Implement K-Means from scratch. What happens if a cluster becomes empty?"
  - **[Interview]** "You need to cluster 10M customer records. K-Means is too slow. What alternatives exist?"

- **Standard Resources:**
  - **Blogs/Articles:** Search: "EM algorithm GMM derivation visual" · Search: "DBSCAN algorithm intuition"
  - **Papers:** Lloyd (1982) "Least Squares Quantization in PCM" · Arthur & Vassilvitskii (2007) "k-means++: The Advantages of Careful Seeding"
  - **Books:** CS229 Lecture Notes 8 (EM Algorithm) · Bishop PRML Ch. 9 · ESL Ch. 13
  - **YouTube:** CS229 Lec 13 · StatQuest: "K-Means Clustering" · Search: "EM algorithm tutorial visual"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "K-Means Clustering", "Implement K-Means Clustering from Scratch"

- **How to Get Started Immediately:**

```python
import numpy as np

class KMeans:
    def __init__(self, k=3, max_iter=100, tol=1e-4):
        self.k, self.max_iter, self.tol = k, max_iter, tol

    def fit(self, X):
        # K-Means++ initialization
        idx = np.random.randint(len(X))
        self.centers = [X[idx]]
        for _ in range(self.k - 1):
            dists = np.min([np.sum((X - c)**2, axis=1) for c in self.centers], axis=0)
            probs = dists / dists.sum()
            self.centers.append(X[np.random.choice(len(X), p=probs)])
        self.centers = np.array(self.centers)

        for _ in range(self.max_iter):
            dists  = np.linalg.norm(X[:, None] - self.centers, axis=2)
            labels = dists.argmin(axis=1)
            new_centers = np.array([X[labels == k].mean(axis=0) for k in range(self.k)])
            if np.allclose(self.centers, new_centers, atol=self.tol): break
            self.centers = new_centers
        self.labels_ = labels
        return self
```

- **Outcomes:**
  - _First Pass:_ K-Means from scratch. Plot Elbow curve. DBSCAN on crescent moons. sklearn GMM on Old Faithful.
  - _Second Pass:_ Full GMM EM (E: responsibilities, M: update μ, Σ, π). Verify log-likelihood increases monotonically.
  - _Third Pass:_ Apply to customer segmentation on real e-commerce data. Deploy Streamlit dashboard with cluster visualization.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Deriving the EM Algorithm: From Jensen's Inequality to Gaussian Mixture Models"
  - Streamlit App: "Interactive K-Means Visualizer — watch convergence in real time"

---

### PCA: Eigendecomposition, SVD, Explained Variance

_Phase 1 · Weeks 13–14 · CS229 Lec 14_

- **What:** Finds orthogonal directions of maximum variance. k-th PC = k-th eigenvector of covariance matrix S = (1/n)XᵀX (after centering). Via SVD: X = UΣVᵀ — columns of V are principal directions, σᵢ²/n are eigenvalues. Projection: Z = XV_k (n×k). Explained variance ratio: σᵢ² / Σⱼσⱼ².

- **Why:** Used for feature compression, noise reduction, visualization (2D/3D embedding), removing multicollinearity. SVD is the mathematical backbone of collaborative filtering (matrix factorization), LSA (Latent Semantic Analysis). SVD-PCA equivalence is a standard ML interview topic.

- **How to Start:** Derive that the first PC maximizes Var[Xw] = wᵀSw subject to ‖w‖=1. Show solution is top eigenvector of S.

- **What Questions to Ask:**
  - Derive the SVD-PCA equivalence: show eigen-decomposition of S = (1/n)XᵀX equals columns of V in SVD of X.
  - How do you choose k? Explained variance ratio and scree plot.
  - What is PCA whitening? When would you use it?
  - **[Interview]** "PCA on a dataset with 1M features and 1000 samples. Which matrix do you decompose and why? (Hint: compute 1000×1000 not 1M×1M)"
  - **[Interview]** "How does t-SNE differ from PCA? When do you prefer each for visualization?"

- **Standard Resources:**
  - **Blogs/Articles:** CS229 Lecture Notes 10 (PCA) · Search: "PCA SVD equivalence derivation" · 3Blue1Brown: "Essence of Linear Algebra" (prerequisite)
  - **Papers:** N/A
  - **Books:** ESL Ch. 3.5 (Principal Components Regression)
  - **YouTube:** CS229 Lec 14 · StatQuest: "Principal Component Analysis (PCA) Step-by-Step"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "PCA Implementation", "Covariance Matrix", "SVD" · Apply PCA to MNIST: visualize top-2 PCs, reconstruct from k PCs

- **How to Get Started Immediately:**

```python
import numpy as np

def pca_from_scratch(X, k):
    X_c = X - X.mean(axis=0)                          # center
    S = (X_c.T @ X_c) / (X_c.shape[0] - 1)           # covariance
    eigenvalues, eigenvectors = np.linalg.eigh(S)
    idx = eigenvalues.argsort()[::-1]                  # sort descending
    eigenvalues = eigenvalues[idx]; eigenvectors = eigenvectors[:, idx]
    V_k = eigenvectors[:, :k]
    Z = X_c @ V_k                                      # project
    explained = eigenvalues[:k].sum() / eigenvalues.sum()
    return Z, V_k, explained

# Verify vs SVD (must match up to sign flips)
X = np.random.randn(100, 10)
Z_eig, _, _ = pca_from_scratch(X, k=2)
U, S, Vt = np.linalg.svd(X - X.mean(axis=0), full_matrices=False)
Z_svd = U[:, :2] * S[:2]
print(np.allclose(np.abs(Z_eig), np.abs(Z_svd)))  # True
```

- **Outcomes:**
  - _First Pass:_ PCA from eigen-decomposition. Verify against sklearn. Visualize MNIST in 2D. Plot scree plot.
  - _Second Pass:_ Incremental PCA for large datasets. Kernel PCA with RBF. Prove SVD-PCA equivalence mathematically.
  - _Third Pass:_ Apply to text data (TF-IDF → PCA → KNN). Compare PCA, t-SNE, UMAP. Deploy as dimensionality reduction API.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "PCA from Scratch: Covariance Matrix to SVD Equivalence"
  - Cheatsheet: "PCA vs t-SNE vs UMAP — When to Use Each (with code)"

---

### Model Evaluation, Metrics & Calibration

_Phase 1 · Weeks 13–14 · Critical for All Production Systems_

- **What:** Classification: Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2PR/(P+R). **ROC-AUC** = P(score(pos) > score(neg)) — threshold-agnostic ranking metric. **PR-AUC** for imbalanced datasets. **Calibration:** P̂(y=1|x) = P(y=1|x) — Reliability diagrams, Brier score, Platt scaling, isotonic regression. Regression: MAE, RMSE, MAPE, R². Multiclass: macro/micro/weighted F1.

- **Why:** Choosing the wrong metric is the most common production ML mistake. A fraud model optimized for accuracy on 99.9% negative data predicts all zeros and claims "99.9% accuracy." Every ML interview includes metric choice questions. Calibration matters enormously in risk-sensitive applications.

- **How to Start:** Implement ROC curve and AUC from scratch. Verify against sklearn.

- **What Questions to Ask:**
  - Explain ROC-AUC as a ranking metric. Why is it threshold-agnostic? What does AUC=0.5 mean geometrically?
  - When is PR-AUC preferred over ROC-AUC? Prove via class imbalance ratio argument.
  - What is the Brier Score? How does it decompose into calibration and resolution?
  - **[Interview]** "You have AUC=0.95 and the business wants to maximize revenue. How do you choose the classification threshold?"
  - **[Interview]** "Your model has Precision=0.9 but Recall=0.3. How do you fix this? Business tradeoffs?"
  - **[Interview]** "Difference between macro-averaged and micro-averaged F1? When does it matter?"
  - How would you evaluate a regression model where large errors are disproportionately costly?

- **Standard Resources:**
  - **Blogs/Articles:** Davis & Goadrich (2006) "The Relationship Between Precision-Recall and ROC Curves" · sklearn calibration guide
  - **Papers:** N/A
  - **Books:** ESL Ch. 7.2
  - **YouTube:** StatQuest: "ROC and AUC explained" · Search: "model calibration tutorial sklearn"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Calculate F1 Score", "Confusion Matrix", "ROC-AUC" · Implement ROC curve from scratch

- **How to Get Started Immediately:**

```python
import numpy as np

def roc_auc_from_scratch(y_true, y_score):
    sorted_idx = np.argsort(y_score)[::-1]
    y_true = y_true[sorted_idx]
    n_pos = y_true.sum(); n_neg = len(y_true) - n_pos
    tps = np.cumsum(y_true); fps = np.cumsum(1 - y_true)
    tpr = tps / n_pos; fpr = fps / n_neg
    return np.trapz(tpr, fpr)  # AUC via trapezoidal rule

# Test
y = np.array([1,1,0,0,1,0])
s = np.array([0.9,0.8,0.4,0.3,0.7,0.6])
print(f"AUC (scratch): {roc_auc_from_scratch(y, s):.4f}")

from sklearn.metrics import roc_auc_score
print(f"AUC (sklearn): {roc_auc_score(y, s):.4f}")  # must match
```

- **Outcomes:**
  - _First Pass:_ Implement all metrics from scratch. Apply to fraud detection dataset.
  - _Second Pass:_ Calibration curves, Platt scaling, isotonic regression. Optimal threshold via cost-sensitive analysis.
  - _Third Pass:_ Streamlit dashboard auto-generating all classification metrics + calibration plots for any sklearn model.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Choosing the Right ML Metric: A Decision Tree for Classification Problems"
  - Streamlit App: "Universal ML Metrics Dashboard — paste any predictions, get full diagnostic report"

---

## PHASE 1.5: Deployment Basics

### Weeks 15–16 · Every project from here must be deployed

---

### Streamlit: Rapid ML Web Apps & Interactive Dashboards

_Phase 1.5 · Week 15_

- **What:** Python-native framework converting Python scripts to interactive web apps with zero HTML/CSS/JS. Widgets (`st.slider`, `st.file_uploader`, `st.dataframe`) are Python function calls. Execution model: re-runs entire script on widget interaction. State via `st.session_state`. `@st.cache_data` and `@st.cache_resource` prevent unnecessary recomputation.

- **Why:** The dominant ML demo tool in industry and academia. Every ML internship involving model deployment uses Streamlit (internal tools) or FastAPI (APIs). A deployed Streamlit app on Hugging Face Spaces with a working model is worth 10x more on a resume than a Jupyter notebook.

- **How to Start:** `pip install streamlit`. Convert your LightGBM + SHAP analysis notebook to a Streamlit app in one hour.

- **What Questions to Ask:**
  - How does Streamlit's execution model work? Performance implications of re-running on each interaction?
  - How do `@st.cache_data` and `@st.cache_resource` differ? When do you use each?
  - When would you choose Streamlit over Gradio or FastAPI + React?
  - **[Interview]** "Walk me through building a live model inference dashboard with Streamlit and a FastAPI backend."

- **Standard Resources:**
  - **Blogs/Articles:** [Streamlit Official Docs](https://docs.streamlit.io) · [Hugging Face Spaces (free deploy)](https://huggingface.co/spaces) · Search: "Streamlit scikit-learn deployment tutorial 2024"
  - **YouTube:** Patrick Loeber: "Streamlit for ML" playlist · Search: "Streamlit SHAP dashboard tutorial"

- **How to Get Started Immediately:**

```python
# pip install streamlit shap lightgbm
# Run: streamlit run app.py

import streamlit as st
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
import shap, matplotlib.pyplot as plt

st.title("🎯 ML Model Inspector")
n_est = st.sidebar.slider("n_estimators", 10, 200, 100)
lr    = st.sidebar.slider("learning_rate", 0.01, 0.5, 0.1)

@st.cache_resource
def train_model(n_est, lr):
    from sklearn.datasets import load_breast_cancer
    X, y = load_breast_cancer(return_X_y=True)
    model = GradientBoostingClassifier(n_estimators=n_est, learning_rate=lr)
    model.fit(X, y)
    return model, X, load_breast_cancer().feature_names

model, X, feat_names = train_model(n_est, lr)

explainer  = shap.TreeExplainer(model)
shap_vals  = explainer.shap_values(X[:50])
fig, ax = plt.subplots()
shap.summary_plot(shap_vals, X[:50], feature_names=feat_names, show=False)
st.pyplot(fig)
st.metric("Training Accuracy", f"{model.score(X, __import__('sklearn.datasets', fromlist=['load_breast_cancer']).load_breast_cancer().target):.3f}")
```

- **Outcomes:**
  - _First Pass:_ Deploy Phase 1 ML models (LightGBM + SHAP) on Hugging Face Spaces. Public URL on resume.
  - _Second Pass:_ Multi-page Streamlit app: EDA page, training page, evaluation metrics page, SHAP explanation page.
  - _Third Pass:_ Streamlit frontend + FastAPI backend. Decouple inference from UI.

- **What I Can Learn From It & Resources to Generate:**
  - Deployed App: "Universal ML Explainability Dashboard" on HuggingFace Spaces — URL on every application
  - Blog: "Deploying LightGBM + SHAP to Hugging Face Spaces in 30 Minutes"

---

### FastAPI: Production ML Inference APIs

_Phase 1.5 · Week 16_

- **What:** ASGI async web framework on Starlette + Pydantic. Auto-generates OpenAPI/Swagger docs. Validates request/response schemas via Pydantic models. Supports async route handlers for concurrent inference. ML pattern: load model at startup via `lifespan` context manager, expose `/predict` endpoint, validate input, run inference, return prediction + metadata.

- **Why:** Industry standard for ML model serving (alongside TorchServe, BentoML). Every production ML system has a REST API layer. Unlike Flask, FastAPI provides automatic type validation, async support, and auto-generated docs — all essential in production. FastAPI knowledge moves you from "ML researcher" to "ML engineer."

- **How to Start:** Wrap your LightGBM model in a FastAPI endpoint with Pydantic schemas. Test via `/docs` Swagger UI.

- **What Questions to Ask:**
  - What is the difference between ASGI and WSGI? Why does async matter for ML serving under concurrent load?
  - How does Pydantic V2 validate and coerce types at runtime? What happens on validation failure?
  - How do you handle model loading at startup (not per-request)?
  - **[Interview]** "Design a FastAPI service that serves a LightGBM model. Handle: (a) concurrent requests, (b) model versioning, (c) input validation."
  - **[Interview]** "Difference between sync and async FastAPI endpoints? When should you use each for ML?"

- **Standard Resources:**
  - **Blogs/Articles:** [FastAPI Official Docs](https://fastapi.tiangolo.com) — best-in-class docs · [Pydantic V2 docs](https://docs.pydantic.dev) · Search: "FastAPI ML model deployment production 2024"
  - **YouTube:** ArjanCodes: "FastAPI Tutorial" series · Search: "FastAPI LightGBM inference production"

- **How to Get Started Immediately:**

```python
# pip install fastapi uvicorn[standard] pydantic joblib

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import joblib, numpy as np

class PredictRequest(BaseModel):
    features: list[float] = Field(..., min_length=4, max_length=4,
                                   description="4 input features")

class PredictResponse(BaseModel):
    prediction: int
    probability: float
    model_version: str

model_registry = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ONCE at startup — not per-request
    model_registry["clf"]     = joblib.load("model.pkl")
    model_registry["version"] = "v1.0.0"
    yield
    model_registry.clear()

app = FastAPI(title="ML Inference API", lifespan=lifespan)

@app.get("/health")
async def health():
    return {"status": "ok", "version": model_registry.get("version")}

@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    X = np.array(req.features).reshape(1, -1)
    pred = model_registry["clf"].predict(X)[0]
    prob = model_registry["clf"].predict_proba(X)[0].max()
    return PredictResponse(prediction=int(pred), probability=float(prob),
                           model_version=model_registry["version"])
# uvicorn main:app --reload → docs at http://localhost:8000/docs
```

- **Outcomes:**
  - _First Pass:_ LightGBM wrapped in FastAPI. Pydantic schemas. Tested via /docs. Deployed on Render/Railway (free).
  - _Second Pass:_ Add background tasks, logging middleware, error handling, health check, model versioning.
  - _Third Pass:_ Containerize with Docker. Add Prometheus metrics. Deploy on VPS with nginx. This is your Phase 1 capstone.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Serving ML Models with FastAPI: Jupyter Notebook to Production API in 1 Hour"
  - GitHub: "ml-api-template" — FastAPI + Pydantic + Docker + GitHub Actions CI

---

## PHASE 2: Deep Learning — From Autograd to PyTorch

### Weeks 17–30 · Build TinyTorch. Understand every gradient. Master PyTorch.

---

### Neural Networks: Universal Approximation, Activations, Forward Pass

_Phase 2 · Weeks 17–18_

- **What:** Feedforward NN: f(x;W) = σₙ(Wₙ·σₙ₋₁(...σ₁(W₁x+b₁)...)+bₙ). **Universal Approximation Theorem** (Hornik 1989): single hidden layer with sufficient width approximates any continuous function on compact ℝⁿ subset. Activations: **ReLU**(z) = max(0,z) — sparse, no vanishing gradient for z>0. **Sigmoid** — saturates (vanishing gradient). **Tanh** — zero-centered. **GELU**(x) = x·Φ(x) — smooth ReLU using Gaussian CDF, used in GPT/BERT.

- **Why:** Understanding the forward pass completely — shapes at each layer, what each weight matrix represents, why activations are non-linear — is essential before backpropagation. ReLU's properties explain why deep networks became trainable. GELU's Gaussian CDF connection is directly relevant for understanding transformers.

- **How to Start:** Implement forward pass for 3-layer MLP in NumPy. Verify output shapes for batch_size=32.

- **What Questions to Ask:**
  - State the Universal Approximation Theorem precisely. What are its limitations (no guidance on how to find weights)?
  - Why does sigmoid cause vanishing gradients? Compute d/dz σ(z) and show saturation for large |z|.
  - Why is ReLU preferred in deep networks? What is the "dying ReLU" problem and how does Leaky ReLU fix it?
  - What is GELU? Write its formula. Why is it used in transformers?
  - For a network [784, 256, 128, 10], what are the parameter counts? Activation shapes for batch=32?
  - **[Interview]** "If you remove all activation functions from a deep network, what does it degenerate to? Prove it."

- **Standard Resources:**
  - **Blogs/Articles:** Search: "universal approximation theorem Hornik 1989" · CS231n: "Neural Network notes" · Search: "dying ReLU problem solutions"
  - **Papers:** Hornik et al. (1989) "Multilayer feedforward networks are universal approximators" · Hendrycks & Gimpel (2016) "Gaussian Error Linear Units (GELUs)"
  - **Books:** Goodfellow, Bengio, Courville "Deep Learning" — Ch. 6
  - **YouTube:** 3Blue1Brown: "Neural Networks" series (chapters 1–4) · CS229 Lec 9
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Single Neuron", "Softmax Activation", "ReLU Activation"

- **How to Get Started Immediately:**

```python
import numpy as np
from scipy.special import erf

# All activations + derivatives (need for backprop)
def relu(z):     return np.maximum(0, z)
def relu_d(z):   return (z > 0).astype(float)
def sigmoid(z):  return 1 / (1 + np.exp(-z))
def sigmoid_d(z):
    s = sigmoid(z); return s * (1 - s)
def gelu(z):     return 0.5 * z * (1 + erf(z / np.sqrt(2)))

# 3-layer forward pass — track every shape
W1 = np.random.randn(784, 256) * np.sqrt(2/784)  # He init
W2 = np.random.randn(256, 128) * np.sqrt(2/256)
W3 = np.random.randn(128, 10)  * np.sqrt(2/128)

x      = np.random.randn(32, 784)   # batch=32
a1     = relu(x  @ W1)              # (32, 256)
a2     = relu(a1 @ W2)              # (32, 128)
logits = a2 @ W3                    # (32,  10)
print([x.shape, a1.shape, a2.shape, logits.shape])
```

- **Outcomes:**
  - _First Pass:_ All activations + forward pass in NumPy. Compare Xavier vs He initialization: measure activation variance collapse.
  - _Second Pass:_ Compare activation distributions at each layer. Plot dead neuron fraction with sigmoid.
  - _Third Pass:_ Begin TinyTorch — implement Tensor class with value + grad storage as first step.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Why ReLU Beats Sigmoid: Vanishing Gradients Visualized Mathematically"
  - Cheatsheet: "All Activation Functions + Derivatives — One Page Reference"

---

### Backpropagation: Computational Graphs & Chain Rule

_Phase 2 · Weeks 19–20_

- **What:** Backpropagation applies the chain rule on a directed acyclic computational graph (DAG). Every operation is a node; edges carry partial derivatives. Backward pass computes ∂L/∂wᵢ for all weights via dynamic programming — sharing intermediate results. Cost = O(forward pass). Key derivation: for softmax + cross-entropy, ∂L/∂zᵢ = pᵢ − yᵢ — one of the most elegant results in ML.

- **Why:** The algorithm behind all of deep learning. Understanding it at the computation graph level — not just matrix calculus — is what separates engineers who debug gradients from those who call `loss.backward()` and hope. Deriving backprop for softmax+CE, LSTM gates, and attention is standard in top-lab interviews.

- **How to Start:** Watch Karpathy's "Building micrograd from scratch" (full video). Then implement the same for matrices.

- **What Questions to Ask:**
  - Derive ∂L/∂W for a linear layer z = Wx + b with upstream gradient δ = ∂L/∂z. Show every matrix dimension.
  - Derive the softmax + cross-entropy gradient. Show ∂L/∂zᵢ = pᵢ − yᵢ.
  - Difference between forward-mode and reverse-mode autodiff? Why does reverse-mode scale to millions of parameters?
  - How does PyTorch's autograd store the computation graph? What is a "leaf tensor" vs "non-leaf tensor"?
  - **[Interview]** "Manually compute the backward pass for z = sigmoid(Wx+b), loss = BCE. Derive ∂L/∂W, ∂L/∂b, ∂L/∂x."
  - **[Interview]** "What does `torch.no_grad()` do under the hood? When must you use it?"
  - How do you verify gradients are correct? Describe numerical gradient checking.

- **Standard Resources:**
  - **Blogs/Articles:** CS231n: "Backpropagation Intuitions" — essential reading · Search: "Yes you should understand backprop Karpathy"
  - **Papers:** Rumelhart, Hinton, Williams (1986) "Learning representations by back-propagating errors" — the original
  - **Books:** Goodfellow DL Ch. 6.5
  - **YouTube:** Karpathy: "The spelled-out intro to neural networks and backpropagation: building micrograd" — 2h, watch every second
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Single Neuron with Backpropagation", "Backpropagation Gradient" · Implement numerical gradient check for all operations

- **How to Get Started Immediately:**

```python
import numpy as np

def numerical_gradient(f, x, h=1e-5):
    """Your truth oracle for verifying analytical gradients."""
    grad = np.zeros_like(x)
    it = np.nditer(x, flags=['multi_index'])
    while not it.finished:
        idx = it.multi_index
        old = x[idx]
        x[idx] = old + h; fp = f(x)
        x[idx] = old - h; fm = f(x)
        grad[idx] = (fp - fm) / (2 * h)
        x[idx] = old; it.iternext()
    return grad

# Verify: d/dW of MSE loss for linear layer
W = np.random.randn(5, 3)
X = np.random.randn(10, 3)
y = np.random.randn(10, 5)

def mse(W): return np.mean((X @ W.T - y)**2)
analytical = (2/X.shape[0]) * (X @ W.T - y).T @ X
numerical  = numerical_gradient(mse, W.copy())
print(f"Max grad error: {np.abs(analytical - numerical).max():.2e}")
# Must be < 1e-7
```

- **Outcomes:**
  - _First Pass:_ Implement forward + backward for linear layer, ReLU, sigmoid, softmax+CE. Verify all gradients numerically.
  - _Second Pass:_ Full MLP backward pass. Train on MNIST from scratch in NumPy. Achieve >95% accuracy.
  - _Third Pass:_ Begin TinyTorch Value class. Build the topological sort + backward traversal engine.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Softmax + Cross-Entropy Backward Pass: The Derivation Every ML Engineer Should Know"
  - Cheatsheet: "Backprop for 8 Common Layers — Forward + Backward in One Page"

---

### TinyTorch: Build Your Own Autograd Engine from Scratch

\*Phase 2 · Weeks 20–22 · mlsysbook.ai/tinytorch · **Spine of Your Portfolio\***

- **What:** TinyTorch (from [mlsysbook.ai/tinytorch](https://mlsysbook.ai/tinytorch/)) is a step-by-step project to build a minimal deep learning framework: (1) **Tensor class** with NumPy backend, (2) **Autograd engine** — computation DAG, topological sort, backward traversal, (3) **Module system** — Linear, ReLU, Loss, (4) **Optimizers** — SGD then Adam, (5) **DataLoader** — batching + shuffling, (6) Optional: CUDA matmul kernel via CuPy. Reference: Karpathy's micrograd extended to tensors.

- **Why:** The single most differentiating project for an ML internship candidate. Proves: (1) you understand computation graphs, not just APIs; (2) you can read PyTorch source code; (3) you know what `.grad_fn`, `.retain_grad()`, and `torch.autograd.Function` do internally. This alone separates you from 95% of ML students.

- **How to Start:** Follow mlsysbook.ai/tinytorch step by step. Watch Karpathy's micrograd video first (scalar version). Then generalize to tensors.

- **What Questions to Ask:**
  - How do you perform topological sort on a computation DAG to ensure correct backward ordering?
  - Why must gradient accumulation (+=) be used instead of gradient assignment (=) in the backward pass?
  - How does PyTorch handle in-place operations with autograd? What is the "version counter"?
  - Difference between `retain_graph=True` and `create_graph=True` in `backward()`?
  - **[Interview]** "Implement a custom PyTorch autograd Function for a non-standard activation. What must `forward()` and `backward()` return?"
  - How would you extend TinyTorch to support higher-order gradients?
  - What is the memory overhead of storing the computation graph during a forward pass?

- **Standard Resources:**
  - **Blogs/Articles:** [mlsysbook.ai/tinytorch/](https://mlsysbook.ai/tinytorch/) — follow the guided project · [Karpathy micrograd](https://github.com/karpathy/micrograd) — reference scalar implementation · PyTorch docs: "Extending PyTorch — custom autograd functions"
  - **Papers:** N/A
  - **Books:** N/A
  - **YouTube:** Karpathy: "Building micrograd from scratch" (2h) — **mandatory** · Search: "PyTorch autograd internals Edward Yang"

- **How to Get Started Immediately:**

```python
# TinyTorch Phase 1: Scalar Value with Autograd
# (Extend to Tensor over next 2 weeks)

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad  += out.grad   # ∂(a+b)/∂a = 1
            other.grad += out.grad   # ∂(a+b)/∂b = 1
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad  += other.data * out.grad  # ∂(ab)/∂a = b
            other.grad += self.data * out.grad   # ∂(ab)/∂b = a
        out._backward = _backward
        return out

    def relu(self):
        out = Value(max(0, self.data), (self,), 'relu')
        def _backward():
            self.grad += (out.data > 0) * out.grad  # ∂relu/∂x = 1{x>0}
        out._backward = _backward
        return out

    def backward(self):
        topo, visited = [], set()
        def build(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev: build(child)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for node in reversed(topo): node._backward()

# Test: z = x*y + y, dz/dx = y, dz/dy = x+1
x = Value(3.0); y = Value(4.0)
z = x * y + y
z.backward()
print(f"dz/dx={x.grad} (expected 4.0)")   # 4.0
print(f"dz/dy={y.grad} (expected 4.0)")   # 3+1=4.0
```

**TinyTorch Milestones:**
| Week | Milestone |
|---|---|
| Week 20 | Scalar Value: +, \*, \*\*, relu, exp, log. Topological sort. Numerical gradient verification. |
| Week 21 | Tensor class (NumPy backend). matmul, sum, mean, reshape. Module base class + Linear layer. Train XOR. |
| Week 22 | SGD + Adam optimizers. DataLoader. Train MLP on MNIST. Compare speed with equivalent PyTorch model. |

- **Outcomes:**
  - _First Pass:_ Scalar Value with +, \*, relu, exp, log. Topo sort backward. Numerically verify all gradients. Match micrograd.
  - _Second Pass:_ Tensor class. Module + Linear. SGD optimizer. Train MNIST to >97% accuracy.
  - _Third Pass:_ Adam optimizer. DataLoader. LayerNorm. Document all design decisions. Add CuPy CUDA backend (optional).

- **What I Can Learn From It & Resources to Generate:**
  - **GitHub Repo:** "TinyTorch — A Minimal Deep Learning Framework from Scratch" — detailed README + architecture diagram — your **#1 portfolio project**
  - Blog Series (3 parts): "Autograd Engine" → "Module System" → "Training MNIST"
  - Cheatsheet: "PyTorch Internal Concepts — Explained via TinyTorch Equivalents"
  - Video: 15-min walkthrough posted on YouTube/LinkedIn

---

### PyTorch: nn.Module, DataLoaders, Training Loops, GPU Training

_Phase 2 · Weeks 23–24_

- **What:** PyTorch core: `torch.Tensor` (ND array + autograd), `nn.Module` (model definition + parameter registration), `nn.functional` (stateless ops), `DataLoader` (batching + parallel loading), `torch.optim` (gradient optimizers), `torch.cuda` (device management). Canonical training loop: forward → loss → backward → optimizer.step → zero_grad. AMP: `torch.autocast` for mixed precision on RTX 4060.

- **Why:** PyTorch is the dominant framework in ML research (85%+ of top conference papers) and rapidly taking over production. Every ML internship expects PyTorch proficiency. After building TinyTorch, PyTorch will feel like a superset of what you built — you'll understand every abstraction at the implementation level.

- **How to Start:** Reimplement your TinyTorch MNIST MLP in PyTorch. Measure the speedup.

- **What Questions to Ask:**
  - Difference between `nn.Module` and `nn.functional`? When do you use each?
  - How does `model.parameters()` track parameters in nested modules?
  - Why must you call `optimizer.zero_grad()` before each backward?
  - What is gradient accumulation? Implement it for simulating batch=512 on 8GB VRAM.
  - How does `DataLoader` handle multiprocessing? What is `num_workers` and `pin_memory`?
  - **[Interview]** "Write a complete PyTorch training loop from scratch: device handling, gradient clipping, LR scheduling, checkpoint saving."
  - What does `torch.compile()` do in PyTorch 2.0? What is TorchDynamo?

- **Standard Resources:**
  - **Blogs/Articles:** [PyTorch Official Tutorials](https://pytorch.org/tutorials/) · Search: "PyTorch 2.0 torch.compile tutorial" · Search: "AMP mixed precision PyTorch RTX guide"
  - **Papers:** Paszke et al. (2019) "PyTorch: An Imperative Style, High-Performance Deep Learning Library" (NeurIPS)
  - **Books:** "Programming PyTorch for Deep Learning" Ian Pointer
  - **YouTube:** Karpathy: "Neural Networks: Zero to Hero" playlist · Search: "PyTorch training loop best practices 2024"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Create a Simple Neural Network" · Train MLP on MNIST to 99%+ — benchmark vs TinyTorch

- **How to Get Started Immediately:**

```python
import torch, torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

class MLP(nn.Module):
    def __init__(self, in_dim=784, hidden=256, out_dim=10):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(hidden, hidden), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(hidden, out_dim)
        )
    def forward(self, x): return self.net(x.view(x.size(0), -1))

device    = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model     = MLP().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=30)
criterion = nn.CrossEntropyLoss()
scaler    = torch.cuda.amp.GradScaler()  # AMP for RTX 4060

def train_epoch(model, loader, optimizer, criterion):
    model.train(); total_loss = 0
    for X, y in loader:
        X, y = X.to(device), y.to(device)
        optimizer.zero_grad()
        with torch.cuda.amp.autocast():           # mixed precision
            loss = criterion(model(X), y)
        scaler.scale(loss).backward()
        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        scaler.step(optimizer); scaler.update()
        total_loss += loss.item()
    scheduler.step()
    return total_loss / len(loader)
```

- **Outcomes:**
  - _First Pass:_ Train MLP on MNIST to 99%+ on GPU. Understand all training loop steps. Plot loss curves.
  - _Second Pass:_ Add wandb/TensorBoard logging. Checkpoint saving/loading. AMP for faster training.
  - _Third Pass:_ `torch.compile()` on your model. Profile with `torch.profiler`. Add gradient accumulation.

- **What I Can Learn From It & Resources to Generate:**
  - GitHub: "PyTorch Training Loop Template — production-ready with AMP, wandb, checkpointing, early stopping"
  - Blog: "torch.compile() in Practice — When It Helps and When It Doesn't"

---

### Optimization: SGD → Momentum → RMSProp → Adam → AdamW

_Phase 2 · Weeks 25–26_

- **What:** **SGD:** θ ← θ − α∇L. **Momentum:** v ← βv + ∇L; θ ← θ − αv. **RMSProp:** E[g²] ← ρE[g²] + (1−ρ)g²; θ ← θ − αg/√(E[g²]+ε). **Adam:** combines momentum + RMSProp with bias correction: m̂ = m/(1−β₁ᵗ), v̂ = v/(1−β₂ᵗ), θ ← θ − αm̂/(√v̂+ε). **AdamW:** decouples L2 weight decay from gradient rescaling — mathematically correct form. LR schedules: cosine annealing, linear warmup + cosine (standard for transformers).

- **Why:** The optimizer is the most impactful hyperparameter in deep learning. AdamW + cosine LR + warmup is standard for all transformer training. Understanding why AdamW ≠ Adam + L2 regularization — and why this matters mathematically — signals deep knowledge in interviews.

- **How to Start:** Implement Adam and AdamW from scratch. Verify against PyTorch on identical initialization and learning rate.

- **What Questions to Ask:**
  - Derive the bias correction terms in Adam. Why does m₁/(1−β₁) converge the first moment estimate?
  - Why is Adam's weight decay mathematically incorrect? How does AdamW fix it?
  - What is Adam's epsilon ε for? What happens if ε is too large?
  - Why does SGD + momentum sometimes generalize better than Adam on image classification?
  - **[Interview]** "Your transformer loss is NaN after 1000 steps. Walk through your debugging checklist."
  - **[Interview]** "What is gradient clipping and why is it essential for transformers?"
  - What is the warmup schedule and why is it necessary for transformer training?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "Adam vs AdamW weight decay difference" · Search: "cosine annealing warmup transformer training"
  - **Papers:** Kingma & Ba (2014) "Adam: A Method for Stochastic Optimization" · Loshchilov & Hutter (2019) "Decoupled Weight Decay Regularization" — AdamW
  - **Books:** Goodfellow DL Ch. 8
  - **YouTube:** CS231n Lecture 7 (optimization) · Search: "Adam optimizer derivation"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Implement Adam Optimizer", "Mini-Batch Gradient Descent" · Add all optimizers to TinyTorch

- **How to Get Started Immediately:**

```python
import numpy as np

class AdamW:
    """AdamW: decoupled weight decay from gradient rescaling."""
    def __init__(self, lr=1e-3, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.01):
        self.lr, self.b1, self.b2 = lr, *betas
        self.eps, self.wd = eps, weight_decay
        self.m, self.v, self.t = {}, {}, 0

    def step(self, params, grads):
        self.t += 1
        for i, (p, g) in enumerate(zip(params, grads)):
            if i not in self.m:
                self.m[i] = np.zeros_like(p)
                self.v[i] = np.zeros_like(p)
            self.m[i] = self.b1 * self.m[i] + (1 - self.b1) * g
            self.v[i] = self.b2 * self.v[i] + (1 - self.b2) * g**2
            m_hat = self.m[i] / (1 - self.b1**self.t)  # bias correction
            v_hat = self.v[i] / (1 - self.b2**self.t)
            # AdamW: weight decay directly on params, NOT scaled by learning rate
            p -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
            p -= self.lr * self.wd * p  # decoupled weight decay
```

- **Outcomes:**
  - _First Pass:_ Add Adam + AdamW to TinyTorch. Compare SGD, Adam, AdamW convergence on toy problem.
  - _Second Pass:_ Implement cosine annealing + linear warmup scheduler. Add gradient clipping. Verify bias correction.
  - _Third Pass:_ Implement Lion optimizer (2023, Google). Compare on NLP task.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Why Adam's Weight Decay is Wrong — and How AdamW Fixes It (with proofs)"
  - GitHub Gist: "All DL Optimizers in 100 Lines of NumPy"

---

### Dropout, Batch Norm, Layer Norm — The DL Regularization Toolkit

_Phase 2 · Weeks 27–28_

- **What:** **Dropout:** set each activation to 0 with probability p during training; scale survivors by 1/(1−p) (inverted dropout). At inference: all neurons active. **Batch Normalization:** BN(x) = γ·(x−μ_B)/σ_B + β, normalized per mini-batch. Reduces internal covariate shift. **Layer Normalization:** normalize across feature dimension (not batch) — batch-size-independent, preferred in transformers. **RMSNorm:** LN without mean subtraction — used in LLaMA.

- **Why:** Dropout is mandatory for regularizing networks on limited data. BatchNorm made very deep networks trainable. LayerNorm is in every transformer (BERT, GPT, T5). Getting normalization choice wrong signals shallow architecture understanding — a common interview failure.

- **How to Start:** Derive the BatchNorm backward pass. Implement LayerNorm in NumPy (needed for TinyTorch transformer).

- **What Questions to Ask:**
  - Derive the BN backward pass. What are ∂L/∂x, ∂L/∂γ, ∂L/∂β?
  - Why does BN fail with small batch sizes? Why is it problematic for RNNs?
  - Why does LayerNorm not have batch dimension dependency?
  - Why is dropout not applied during inference? What is the mathematical justification for scaling?
  - **[Interview]** "You're training a 24-layer transformer and loss explodes. What normalization do you add and where? (Pre-LN vs Post-LN)"
  - **[Interview]** "Why does BatchNorm act as a regularizer? Explain via the noise-injection perspective."

- **Standard Resources:**
  - **Blogs/Articles:** Search: "batch normalization forward backward derivation" · Search: "Pre-LayerNorm vs Post-LayerNorm transformer training stability"
  - **Papers:** Srivastava et al. (2014) "Dropout" · Ioffe & Szegedy (2015) "Batch Normalization" · Ba et al. (2016) "Layer Normalization"
  - **Books:** Goodfellow DL Ch. 7
  - **YouTube:** Search: "batch normalization explained derivation" · Search: "layer normalization vs batch normalization"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Batch Normalization", "Dropout Regularization" · Add LayerNorm to TinyTorch

- **How to Get Started Immediately:**

```python
import numpy as np

class LayerNorm:
    """Layer Normalization — essential for Transformer implementation."""
    def __init__(self, d_model, eps=1e-6):
        self.eps = eps
        self.gamma = np.ones(d_model)    # learnable scale
        self.beta  = np.zeros(d_model)   # learnable shift

    def forward(self, x):
        # x: (..., d_model) — normalize over last dim
        mean = x.mean(axis=-1, keepdims=True)
        var  = x.var(axis=-1, keepdims=True)
        x_norm = (x - mean) / np.sqrt(var + self.eps)
        return self.gamma * x_norm + self.beta  # affine transform

# Verify vs PyTorch
import torch
x = np.random.randn(4, 16, 64).astype(np.float32)  # (batch, seq, d_model)
ln_np = LayerNorm(64).forward(x)
ln_pt = torch.nn.LayerNorm(64)(torch.tensor(x))
print(np.allclose(ln_np, ln_pt.detach().numpy(), atol=1e-5))  # True
```

- **Outcomes:**
  - _First Pass:_ Implement Dropout + BN in NumPy (forward+backward). Add LayerNorm to TinyTorch.
  - _Second Pass:_ Derive BN backward pass from scratch. Implement Pre-LN vs Post-LN transformer blocks. Compare stability.
  - _Third Pass:_ Implement RMSNorm (LLaMA). Compare LN vs RMSNorm computational cost.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "BatchNorm vs LayerNorm — The Complete Derivation and When to Use Each"
  - Cheatsheet: "Normalization Layers Comparison: BN, LN, IN, GN, RMSNorm"

---

### RNNs, LSTMs, GRUs: Sequential Processing & BPTT

_Phase 2 · Weeks 29–30_

- **What:** **RNN:** hₜ = tanh(Wₕhₜ₋₁ + Wₓxₜ + b). **BPTT:** unroll T steps, sum gradients — suffers vanishing/exploding gradients when ‖∂hₜ/∂hₜ₋₁‖ < 1 repeatedly. **LSTM:** forget gate fₜ = σ(Wf[hₜ₋₁,xₜ]), input gate iₜ, output gate oₜ, cell Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙C̃ₜ. Cell state = gradient highway (constant error carousel). **GRU:** merged forget+input into update gate — fewer parameters, comparable performance.

- **Why:** RNNs are largely superseded by transformers in NLP, but: (1) LSTM gating intuition directly transfers to understanding attention; (2) still used in streaming/real-time applications; (3) BPTT is a canonical interview topic; (4) modern state-space models (Mamba, S4) are RNN variants resurging in 2024.

- **How to Start:** Implement vanilla RNN forward + BPTT backward in NumPy. Verify gradients numerically.

- **What Questions to Ask:**
  - Derive BPTT for vanilla RNN. Show why gradients vanish when ‖∂hₜ/∂hₜ₋₁‖ < 1 over T steps.
  - Write all four LSTM gate equations. Explain why the cell state Cₜ allows gradient flow without vanishing.
  - Difference between LSTM and GRU in parameters and memory? When does GRU match LSTM?
  - **[Interview]** "Implement a character-level language model using LSTM in PyTorch. What is the output shape at each timestep?"
  - **[Interview]** "How do you handle variable-length sequences in batched RNN? What is `pack_padded_sequence`?"
  - What is the modern relevance of RNNs in 2024? (Mamba/SSM)

- **Standard Resources:**
  - **Blogs/Articles:** Colah's blog: "Understanding LSTMs" — the definitive visual explanation (must read) · Karpathy: "The Unreasonable Effectiveness of Recurrent Neural Networks"
  - **Papers:** Hochreiter & Schmidhuber (1997) "Long Short-Term Memory" · Cho et al. (2014) "Learning Phrase Representations using RNN Encoder-Decoder" (GRU paper)
  - **Books:** Goodfellow DL Ch. 10
  - **YouTube:** Search: "LSTM from scratch PyTorch tutorial" · Search: "BPTT derivation vanishing gradient"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Implementing a Simple RNN" · Train char-level LM on Shakespeare dataset

- **How to Get Started Immediately:**

```python
import torch, torch.nn as nn

class CharLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim=64, hidden_dim=256, num_layers=2):
        super().__init__()
        self.embed  = nn.Embedding(vocab_size, embed_dim)
        self.lstm   = nn.LSTM(embed_dim, hidden_dim, num_layers,
                              batch_first=True, dropout=0.2)
        self.fc     = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden=None):
        # x: (batch, seq_len) — token indices
        emb = self.embed(x)                # (batch, seq, embed_dim)
        out, hidden = self.lstm(emb, hidden) # (batch, seq, hidden_dim)
        logits = self.fc(out)               # (batch, seq, vocab_size)
        return logits, hidden              # predict next char at each step

# Key shapes to understand:
# Input: (32, 100) — batch of 32 sequences of 100 chars
# Output: (32, 100, vocab_size) — next char prediction at each position
# Loss: cross-entropy on shifted targets: output[:, :-1] vs input[:, 1:]
```

- **Outcomes:**
  - _First Pass:_ PyTorch LSTM char-level LM on Shakespeare. Generate text. Understand hidden state dimensions.
  - _Second Pass:_ Implement vanilla RNN + BPTT in NumPy. Verify gradients numerically. Observe vanishing gradient magnitude.
  - _Third Pass:_ Add attention mechanism to LSTM encoder-decoder. This is the conceptual bridge to transformers.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "LSTM from Scratch: Deriving All 4 Gates and the Constant Error Carousel"
  - GitHub: Char-level LSTM text generator with Streamlit demo — generates Shakespeare-like text
  - Cheatsheet: "RNN vs LSTM vs GRU vs Transformer — Gradient Flow Comparison"

---

## PHASE 3: NLP & Transformers

### Weeks 31–40 · The core of modern ML engineering

---

### Word Embeddings: Word2Vec, GloVe, FastText

_Phase 3 · Weeks 31–32_

- **What:** Dense vector representations of words in continuous space such that semantic similarity ≈ geometric proximity. **Word2Vec (Mikolov 2013):** CBOW (predict center from context) and Skip-gram (predict context from center), trained via negative sampling. Objective: maximize log P(wₒ|wᵢ) = log σ(vₒᵀvᵢ) + Σₖ log σ(−vₖᵀvᵢ). **GloVe:** factorizes global co-occurrence matrix. **FastText:** subword embeddings (handles OOV). Properties: "king − man + woman ≈ queen" via vector arithmetic.

- **Why:** Word embeddings are the conceptual foundation of all NLP. Understanding them explains why transformer embeddings work — they're initialized or pre-trained using similar objectives. Negative sampling is the key optimization insight enabling scalable training on billion-token corpora.

- **How to Start:** Train Word2Vec from scratch using PyTorch on a small corpus. Verify semantic similarity via cosine distance.

- **What Questions to Ask:**
  - Derive the Skip-gram objective with negative sampling. Why is negative sampling more computationally efficient than full softmax over vocabulary?
  - What is the dimensionality of the embedding vs the vocabulary? What is the embedding matrix shape?
  - What is the mathematical basis for the "king − man + woman = queen" analogy?
  - What is subword tokenization (BPE, WordPiece) and why does it handle OOV better than word-level embeddings?
  - **[Interview]** "How would you use pre-trained embeddings for a text classification task with limited labeled data?"
  - **[Interview]** "What is the difference between static embeddings (Word2Vec) and contextual embeddings (BERT)?"

- **Standard Resources:**
  - **Blogs/Articles:** Search: "word2vec negative sampling derivation tutorial" · Search: "GloVe vs Word2Vec comparison"
  - **Papers:** Mikolov et al. (2013) "Distributed Representations of Words and Phrases" (Word2Vec) · Pennington et al. (2014) "GloVe: Global Vectors for Word Representation"
  - **Books:** Jurafsky & Martin "Speech and Language Processing" — Ch. 6 (3rd edition, free online)
  - **YouTube:** Stanford CS224N Lec 1–2 (Word Vectors) · Search: "Word2Vec from scratch PyTorch"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Cosine Similarity" · Implement Word2Vec Skip-gram + negative sampling in PyTorch from scratch

- **How to Get Started Immediately:**

```python
import torch, torch.nn as nn

class SkipGram(nn.Module):
    """Word2Vec Skip-gram with negative sampling."""
    def __init__(self, vocab_size, embed_dim):
        super().__init__()
        # Two embedding matrices: center words and context words
        self.center_embed  = nn.Embedding(vocab_size, embed_dim)
        self.context_embed = nn.Embedding(vocab_size, embed_dim)

    def forward(self, center, context, negatives):
        # center:    (batch,) — center word indices
        # context:   (batch,) — positive context word indices
        # negatives: (batch, k) — k negative sample indices
        v_c = self.center_embed(center)         # (batch, embed_dim)
        v_o = self.context_embed(context)       # (batch, embed_dim)
        v_n = self.context_embed(negatives)     # (batch, k, embed_dim)

        # Positive loss: -log σ(vₒᵀvᵢ)
        pos_loss = -torch.log(torch.sigmoid((v_c * v_o).sum(dim=-1))).mean()
        # Negative loss: -Σ log σ(-vₙᵀvᵢ)
        neg_loss = -torch.log(torch.sigmoid(
            -(v_n * v_c.unsqueeze(1)).sum(dim=-1))).mean()
        return pos_loss + neg_loss

# After training, retrieve embeddings:
# embeddings = model.center_embed.weight.detach().numpy()
# similarity = cosine(embeddings[word_to_idx["king"]] - embeddings[word_to_idx["man"]]
#                     + embeddings[word_to_idx["woman"]], embeddings)
```

- **Outcomes:**
  - _First Pass:_ Load pre-trained GloVe/FastText embeddings via `gensim`. Compute word analogies. Visualize with t-SNE.
  - _Second Pass:_ Train Word2Vec Skip-gram from scratch in PyTorch on a text corpus. Verify "king−man+woman≈queen".
  - _Third Pass:_ Use embeddings as features for a downstream classification task. Compare pre-trained vs trained-from-scratch embeddings.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Word2Vec from Scratch: Deriving Skip-gram with Negative Sampling"
  - GitHub: "Word embedding visualizer" — t-SNE plot of semantic clusters (Streamlit)

---

### Attention Mechanism: Scaled Dot-Product & Multi-Head Attention

_Phase 3 · Weeks 33–34_

- **What:** **Scaled Dot-Product Attention:** Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V. Q (query), K (key), V (value) are linear projections of input. Scaling by √dₖ prevents softmax saturation for large dₖ. **Multi-Head Attention:** run h attention heads in parallel on projected subspaces, concatenate and project: MHA(Q,K,V) = Concat(head₁,...,headₕ)Wᵒ where headᵢ = Attention(QWᵢQ, KWᵢK, VWᵢV). Complexity: O(n²d) in sequence length n — the quadratic bottleneck.

- **Why:** Attention is the core mechanism of every modern NLP model. Understanding why scaling by √dₖ is necessary, why multiple heads are needed (different subspace attention patterns), and the quadratic complexity bottleneck (motivating sparse attention, linear attention) is foundational for any deep work in NLP engineering.

- **How to Start:** Implement scaled dot-product attention in NumPy. Add masking for causal (autoregressive) attention.

- **What Questions to Ask:**
  - Why do we scale by √dₖ? Derive what happens to softmax gradients when dot products grow proportional to dₖ.
  - What does each attention head learn? Why do multiple heads capture different semantic relationships?
  - What is causal masking and why is it needed for autoregressive decoding?
  - What is the computational complexity of attention? Why is it quadratic in sequence length?
  - **[Interview]** "Implement scaled dot-product attention from scratch. Handle both self-attention and cross-attention."
  - **[Interview]** "What modifications to attention have been proposed to reduce the O(n²) complexity? Name 3 with their approach."
  - How does positional encoding interact with the attention mechanism?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "attention mechanism illustrated Jay Alammar" — read "The Illustrated Transformer" · Search: "scaled dot product attention derivation"
  - **Papers:** Bahdanau et al. (2015) "Neural Machine Translation by Jointly Learning to Align and Translate" — original attention · Vaswani et al. (2017) "Attention Is All You Need" — transformer paper
  - **Books:** Jurafsky & Martin Ch. 10 (Transformers)
  - **YouTube:** CS224N Lec 9 (Self-Attention and Transformers) · Search: "attention mechanism from scratch PyTorch"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Self-Attention Mechanism", "Scaled Dot-Product Attention" · Implement MHA from scratch and verify shapes

- **How to Get Started Immediately:**

```python
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (..., seq_q, d_k)
    K: (..., seq_k, d_k)
    V: (..., seq_k, d_v)
    Returns: (..., seq_q, d_v)
    """
    d_k = Q.shape[-1]
    # Scaled dot-product: QKᵀ / √dₖ
    scores = Q @ K.swapaxes(-2, -1) / np.sqrt(d_k)  # (..., seq_q, seq_k)

    # Causal mask: upper triangle → -inf (for autoregressive models)
    if mask is not None:
        scores = np.where(mask == 0, scores, -1e9)

    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights /= weights.sum(axis=-1, keepdims=True)  # softmax

    return weights @ V  # (..., seq_q, d_v)

# Test shapes
seq, d_k, d_v = 10, 64, 64
Q = np.random.randn(2, seq, d_k)  # (batch, seq, d_k)
K = np.random.randn(2, seq, d_k)
V = np.random.randn(2, seq, d_v)
out = scaled_dot_product_attention(Q, K, V)
print(out.shape)  # (2, 10, 64)
```

- **Outcomes:**
  - _First Pass:_ Scaled dot-product attention in NumPy. Add causal mask. Verify output shapes.
  - _Second Pass:_ Implement Multi-Head Attention module in PyTorch. Compare with `nn.MultiheadAttention` on identical inputs.
  - _Third Pass:_ Add attention to TinyTorch. Visualize attention weights on a toy sequence-to-sequence task.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Scaled Dot-Product Attention: Why √dₖ Scaling Matters (with derivation)"
  - GitHub Gist: "Attention from Scratch: NumPy implementation with causal masking"
  - Cheatsheet: "Attention Mechanism Variants — Sparse, Linear, Flash, Local — one page"

---

### Transformer Architecture: Encoder, Decoder, Full Stack

_Phase 3 · Weeks 35–36_

- **What:** Full transformer stack from "Attention Is All You Need" (Vaswani et al. 2017). **Encoder block:** Input Embedding + Positional Encoding → [Multi-Head Self-Attention → Add & Norm → FFN → Add & Norm] × N. **Decoder block:** adds cross-attention layer between self-attention and FFN, with causal masking on self-attention. **FFN:** two linear transformations with ReLU: FFN(x) = max(0, xW₁+b₁)W₂+b₂. **Positional Encoding:** PE(pos, 2i) = sin(pos/10000^(2i/d)), PE(pos,2i+1) = cos(pos/10000^(2i/d)).

- **Why:** Every NLP model since 2018 is a transformer variant: BERT (encoder-only), GPT (decoder-only), T5 (encoder-decoder), LLaMA (decoder-only + RMSNorm + RoPE). Building a transformer from scratch is the definitive project that proves deep technical understanding and directly enables fine-tuning and LLM engineering work.

- **How to Start:** Follow Karpathy's "Let's build GPT from scratch" video (3h). Build a mini-GPT (decoder-only transformer) on a text corpus.

- **What Questions to Ask:**
  - What is the purpose of positional encoding? Why sinusoidal? What properties does it have?
  - Why is Pre-Layer Normalization (Pre-LN) more stable than Post-LN for training deep transformers?
  - What is the role of the FFN layer in a transformer block? Why is it 4× wider than d_model?
  - Why is the encoder-decoder attention "cross-attention"? What are Q, K, V in that case?
  - What is the parameter count of a transformer with d_model=512, N=6 layers, 8 heads, vocab=30000?
  - **[Interview]** "Implement a transformer encoder block in PyTorch from scratch. No `nn.TransformerEncoder`."
  - **[Interview]** "What is KV-cache and how does it accelerate autoregressive decoding?"

- **Standard Resources:**
  - **Blogs/Articles:** "The Illustrated Transformer" by Jay Alammar — mandatory reading · "The Annotated Transformer" by Harvard NLP — line-by-line code walkthrough
  - **Papers:** Vaswani et al. (2017) "Attention Is All You Need" — read every section
  - **Books:** Jurafsky & Martin Ch. 10 · Tunstall et al. "Natural Language Processing with Transformers" (HuggingFace book, free)
  - **YouTube:** Karpathy: "Let's build GPT from scratch, in code, spelled out" (3h YouTube) — **mandatory**
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems): "Transformer Architecture", "Positional Encoding" · Implement full encoder-decoder transformer and train on toy translation task

- **How to Get Started Immediately:**

```python
import torch, torch.nn as nn, math

class TransformerEncoderBlock(nn.Module):
    """A single encoder layer: MHA → Add&Norm → FFN → Add&Norm"""
    def __init__(self, d_model=512, n_heads=8, d_ff=2048, dropout=0.1):
        super().__init__()
        self.attn   = nn.MultiheadAttention(d_model, n_heads, dropout=dropout,
                                             batch_first=True)
        self.ff     = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        self.norm1  = nn.LayerNorm(d_model)
        self.norm2  = nn.LayerNorm(d_model)
        self.drop   = nn.Dropout(dropout)

    def forward(self, x, src_key_padding_mask=None):
        # Pre-LN variant (more stable for deep transformers)
        attn_out, _ = self.attn(self.norm1(x), self.norm1(x), self.norm1(x),
                                key_padding_mask=src_key_padding_mask)
        x = x + self.drop(attn_out)    # residual connection
        x = x + self.drop(self.ff(self.norm2(x)))
        return x

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        pos = torch.arange(max_len).unsqueeze(1)
        div = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer('pe', pe.unsqueeze(0))  # (1, max_len, d_model)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]
```

- **Outcomes:**
  - _First Pass:_ Read "Attention Is All You Need" and "The Illustrated Transformer." Implement PositionalEncoding and TransformerEncoderBlock in PyTorch.
  - _Second Pass:_ Build mini-GPT (decoder-only) following Karpathy's tutorial. Train on Shakespeare (~1M chars). Generate text.
  - _Third Pass:_ Add to TinyTorch: MHA module + transformer block. Train a character-level transformer from TinyTorch.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Building a Transformer from Scratch: Every Design Choice Explained"
  - GitHub: "mini-GPT from scratch" — trained and deployed with text generation Streamlit demo
  - Cheatsheet: "Transformer Architecture Cheatsheet — all dimensions annotated"

---

### BERT & Encoder Models: Pretraining, MLM, NSP

_Phase 3 · Weeks 37–38_

- **What:** BERT (Devlin et al. 2019): bidirectional transformer encoder pretrained on (1) **MLM (Masked Language Modeling):** randomly mask 15% of tokens, predict masked tokens from bidirectional context — unlike GPT's causal left-to-right. (2) **NSP (Next Sentence Prediction):** predict if sentence B follows sentence A. Fine-tuning: add task-specific head on top of `[CLS]` token representation. BERT-base: 12 layers, 12 heads, d_model=768, 110M params.

- **Why:** BERT and its variants (RoBERTa, DeBERTa, DistilBERT) dominate text classification, NER, QA, and sentence similarity tasks in production. Understanding pretraining objectives explains why fine-tuning works on small datasets. The `[CLS]` token representation is the sentence embedding used in all downstream classification.

- **How to Start:** Fine-tune BERT-base on SST-2 sentiment classification using HuggingFace. Understand every API call you make.

- **What Questions to Ask:**
  - Why is MLM bidirectional while GPT is autoregressive? What is the trade-off in terms of downstream task suitability?
  - What is the `[CLS]` token and why does its representation capture sentence-level semantics?
  - What is the `[SEP]` and `[MASK]` token? Why does BERT use 80% mask / 10% random / 10% unchanged in MLM?
  - **[Interview]** "When would you use BERT vs GPT for a task? Give concrete examples."
  - **[Interview]** "Your BERT fine-tuned model has high training accuracy but poor generalization on customer data. What is catastrophic forgetting and how do you address it?"
  - What is RoBERTa? How does it differ from BERT (no NSP, dynamic masking, more data)?
  - What is DistilBERT? How does knowledge distillation produce a smaller BERT?

- **Standard Resources:**
  - **Blogs/Articles:** "The Illustrated BERT" by Jay Alammar — mandatory · Search: "BERT fine-tuning text classification HuggingFace tutorial"
  - **Papers:** Devlin et al. (2019) "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" · Liu et al. (2019) "RoBERTa"
  - **Books:** Tunstall et al. "NLP with Transformers" Ch. 2–4
  - **YouTube:** CS224N Lec 11 (Transformers and BERT) · Search: "BERT explained Yannic Kilcher"
  - **Problem Sets:** [deep-ml.com](https://www.deep-ml.com/problems) · Fine-tune BERT on: (1) SST-2 sentiment, (2) CoNLL-2003 NER, (3) SQuAD QA

- **How to Get Started Immediately:**

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datasets import load_dataset
import torch
from torch.optim import AdamW
from transformers import get_linear_schedule_with_warmup

model_name = "bert-base-uncased"
tokenizer  = AutoTokenizer.from_pretrained(model_name)
model      = AutoModelForSequenceClassification.from_pretrained(
                 model_name, num_labels=2)

# Load SST-2 sentiment
dataset = load_dataset("glue", "sst2")

def tokenize(batch):
    return tokenizer(batch["sentence"], truncation=True,
                     padding="max_length", max_length=128)

dataset = dataset.map(tokenize, batched=True)
dataset.set_format("torch", columns=["input_ids", "attention_mask", "label"])

# Fine-tuning setup
device    = torch.device("cuda")
model     = model.to(device)
optimizer = AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)

# Linear warmup + decay (standard for BERT fine-tuning)
total_steps = len(dataset["train"]) // 32 * 3  # 3 epochs
scheduler   = get_linear_schedule_with_warmup(
    optimizer, num_warmup_steps=total_steps // 10,
    num_training_steps=total_steps
)
```

- **Outcomes:**
  - _First Pass:_ Fine-tune BERT-base on SST-2. Achieve >93% accuracy. Understand all HuggingFace API calls.
  - _Second Pass:_ Fine-tune on a custom dataset. Implement evaluation loop with sklearn metrics. Save and load checkpoints.
  - _Third Pass:_ Apply LoRA (PEFT) to BERT fine-tuning. Compare full fine-tune vs LoRA on GPU memory and accuracy.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "BERT Fine-tuning from Scratch: Every API Call Explained"
  - GitHub: "Text Classification with BERT + LoRA — 2MB checkpoint for 93% accuracy"
  - FastAPI endpoint: serve fine-tuned BERT for real-time sentiment scoring

---

### GPT & Decoder-Only Models: Language Modeling, In-Context Learning

_Phase 3 · Weeks 38–39_

- **What:** GPT-style models: decoder-only transformer with causal (left-to-right) self-attention mask. Trained on next-token prediction: L = −Σₜ log P(xₜ|x₁,...,xₜ₋₁). **GPT-2 (117M–1.5B):** zero-shot task performance via prompt engineering. **GPT-3 (175B):** few-shot in-context learning without gradient updates — k examples in the prompt shift behavior. **In-context learning:** the model uses the prompt's examples as implicit gradient updates (Bayesian interpretation: posterior update via attention over context).

- **Why:** GPT-style decoder-only models are the architecture of ChatGPT, LLaMA, Mistral, Falcon, and every modern LLM. Understanding the autoregressive objective, KV-cache for inference, and in-context learning is the prerequisite for all Phase 4 LLM engineering work.

- **How to Start:** You already built mini-GPT in Week 35–36. Now load GPT-2 via HuggingFace and generate text with temperature sampling, top-k, and top-p (nucleus) sampling.

- **What Questions to Ask:**
  - What is the difference between GPT's autoregressive training and BERT's MLM? Which is better for generation vs understanding?
  - What is KV-cache? How does it reduce autoregressive decoding from O(n²) to O(n)?
  - What is temperature sampling? Top-k? Top-p (nucleus)? When do you use each?
  - What is in-context learning? Why can GPT-3 perform few-shot tasks without gradient updates?
  - **[Interview]** "Design a system to serve GPT-2 for real-time text generation at 100 requests/second. What optimizations do you apply?"
  - **[Interview]** "Explain the difference between greedy decoding, beam search, and nucleus sampling. Trade-offs?"

- **Standard Resources:**
  - **Blogs/Articles:** "The Illustrated GPT-2" by Jay Alammar · Search: "in-context learning statistical explanation"
  - **Papers:** Radford et al. (2018) "Improving Language Understanding by Generative Pre-Training" (GPT) · Radford et al. (2019) "Language Models are Unsupervised Multitask Learners" (GPT-2) · Brown et al. (2020) "Language Models are Few-Shot Learners" (GPT-3)
  - **Books:** Tunstall et al. "NLP with Transformers" Ch. 5
  - **YouTube:** Karpathy: "Let's build GPT from scratch" · Search: "GPT-2 explanation Yannic Kilcher"
  - **Problem Sets:** Generate text with GPT-2 using all sampling strategies. Implement KV-cache from scratch.

- **How to Get Started Immediately:**

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

model     = GPT2LMHeadModel.from_pretrained("gpt2").cuda()
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token

def generate(prompt, max_new_tokens=100, temperature=0.8, top_p=0.9):
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=temperature,   # controls randomness
            top_p=top_p,               # nucleus sampling
            top_k=50,                  # also limit to top-50 tokens
            repetition_penalty=1.2,    # penalize repeated tokens
            pad_token_id=tokenizer.eos_token_id
        )
    return tokenizer.decode(output[0], skip_special_tokens=True)

print(generate("In machine learning, gradient descent is"))
```

- **Outcomes:**
  - _First Pass:_ Load GPT-2. Experiment with all sampling strategies. Deploy text generation Streamlit app.
  - _Second Pass:_ Implement KV-cache from scratch on your mini-GPT. Measure inference speedup.
  - _Third Pass:_ Fine-tune GPT-2 on a custom domain (e.g., technical documentation, code). Deploy as generation API.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Temperature, Top-k, Top-p Sampling — When to Use Each and Why"
  - GitHub: "GPT-2 Text Generator" with Streamlit interface — sliders for all sampling parameters

---

### Fine-tuning: Full Fine-tune, LoRA, PEFT, Instruction Tuning

_Phase 3 · Weeks 39–40_

- **What:** **Full fine-tuning:** update all parameters on labeled data. GPU-intensive (needs full model VRAM). **LoRA (Low-Rank Adaptation):** freeze base model, add low-rank matrices ΔW = BA (B: d×r, A: r×k, r << min(d,k)) to each attention weight. Only B and A are trained — 10–1000x fewer parameters. **QLoRA:** 4-bit quantize base model + LoRA adapters in 16-bit. Enables 7B model fine-tuning on 8GB VRAM (your RTX 4060). **PEFT library (HuggingFace):** standardizes LoRA, prefix tuning, prompt tuning. **Instruction tuning:** fine-tune on (instruction, response) pairs to improve instruction-following.

- **Why:** LoRA/QLoRA is the dominant industry technique for adapting pre-trained LLMs to new domains without full retraining costs. In internships involving LLM customization, PEFT knowledge is directly applicable on day one. QLoRA makes 7B model fine-tuning feasible on your RTX 4060.

- **How to Start:** Fine-tune a HuggingFace model on a custom dataset using PEFT/LoRA. Compare GPU memory usage vs full fine-tuning.

- **What Questions to Ask:**
  - Derive why ΔW = BA is a rank-r update. Why does this reduce parameters from d×k to d×r + r×k?
  - What is the initialization scheme for LoRA? Why is B initialized to zero?
  - What is 4-bit quantization (NF4, INT4)? How does QLoRA combine quantization + LoRA?
  - What is catastrophic forgetting? How does LoRA mitigate it?
  - **[Interview]** "You need to fine-tune a 7B LLM on 10,000 customer service conversations on 8GB VRAM. Describe your approach."
  - **[Interview]** "Explain the difference between LoRA rank r=8 and r=64. What is the practical effect on model expressiveness?"
  - What is instruction tuning? How does it differ from standard supervised fine-tuning?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "LoRA fine-tuning explained tutorial 2024" · Search: "QLoRA 4-bit quantization RTX 4060" · HuggingFace PEFT documentation
  - **Papers:** Hu et al. (2022) "LoRA: Low-Rank Adaptation of Large Language Models" · Dettmers et al. (2023) "QLoRA: Efficient Finetuning of Quantized LLMs"
  - **Books:** Tunstall et al. "NLP with Transformers" Ch. 9
  - **YouTube:** Search: "LoRA explained visually" · Search: "QLoRA fine-tuning tutorial RTX 4090 4060"
  - **Problem Sets:** Fine-tune Mistral-7B on a custom dataset using QLoRA on your RTX 4060. Compare with BERT full fine-tune on same task.

- **How to Get Started Immediately:**

```python
# pip install peft transformers bitsandbytes accelerate datasets
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, TaskType

# QLoRA: load in 4-bit
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype="bfloat16",
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    quantization_config=bnb_config,
    device_map="auto"  # auto-splits across GPU/CPU if needed
)

# LoRA configuration
lora_cfg = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,              # rank — fewer params, less expressiveness
    lora_alpha=32,     # scaling factor: ΔW = (alpha/r) * BA
    target_modules=["q_proj", "v_proj"],  # which layers to adapt
    lora_dropout=0.05,
    bias="none",
)
model = get_peft_model(model, lora_cfg)
model.print_trainable_parameters()
# Trainable params: ~6.8M / 3.75B — only 0.18% of parameters!
```

- **Outcomes:**
  - _First Pass:_ Fine-tune BERT with LoRA on SST-2. Compare GPU memory vs full fine-tune. Understand PEFT API.
  - _Second Pass:_ QLoRA fine-tune Mistral-7B on a custom instruction dataset (alpaca-format) on your RTX 4060.
  - _Third Pass:_ Evaluate fine-tuned model using ROUGE, BERTScore, or task-specific metrics. Deploy via FastAPI.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "LoRA Derivation: Why Low-Rank Updates Work and How QLoRA Fits 7B in 8GB VRAM"
  - GitHub: "QLoRA fine-tuning template — Mistral-7B on custom data, RTX 4060 optimized"
  - Cheatsheet: "Fine-tuning Decision Tree: Full FT vs LoRA vs QLoRA vs Prompt Tuning"

---

### HuggingFace Ecosystem: Transformers, Datasets, Hub, Evaluate

_Phase 3 · Week 40_

- **What:** HuggingFace provides: **`transformers`** — 200k+ pretrained models with unified API (`AutoModel`, `AutoTokenizer`, `pipeline()`). **`datasets`** — 10k+ datasets with streaming support. **`peft`** — parameter-efficient fine-tuning. **`evaluate`** — standardized metric computation. **`accelerate`** — distributed training abstraction. **`hub`** — model/dataset/space hosting. **`trl`** — RLHF, DPO, SFT training. The HuggingFace Hub is the central registry of the modern ML ecosystem.

- **Why:** HuggingFace is the operating system of NLP engineering. Every production NLP team uses it. Proficiency with the full HF ecosystem — especially `transformers`, `peft`, `datasets`, and `Hub` — is expected at any NLP/LLM internship.

- **How to Start:** Use `pipeline()` to run zero-shot classification, NER, summarization. Then implement the same task with `AutoModel` + tokenizer without `pipeline()` to understand what's being abstracted.

- **What Questions to Ask:**
  - What does `AutoTokenizer.from_pretrained()` do under the hood?
  - What is the difference between `pipeline()` and using `AutoModel` directly?
  - How does HuggingFace `datasets` handle larger-than-RAM datasets? (streaming, memory-mapped Arrow files)
  - **[Interview]** "How do you push your fine-tuned model to the HuggingFace Hub and make it publicly accessible?"
  - **[Interview]** "What are the different model classes in `transformers`? (AutoModel, AutoModelForSequenceClassification, etc.)"

- **Standard Resources:**
  - **Blogs/Articles:** [HuggingFace Documentation](https://huggingface.co/docs/transformers) — your primary reference · Search: "HuggingFace datasets streaming tutorial"
  - **Books:** Tunstall et al. "NLP with Transformers" — read end-to-end
  - **YouTube:** Search: "HuggingFace transformers tutorial complete 2024"
  - **Problem Sets:** Reproduce any paper result using HF models. Push your fine-tuned model to Hub as a public demo.

- **How to Get Started Immediately:**

```python
from transformers import pipeline

# Zero-shot: 5 lines to run a state-of-the-art NLP model
clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
result = clf("Machine learning is transforming healthcare",
             candidate_labels=["technology", "medicine", "finance"])
print(result)  # {'labels': ['technology', ...], 'scores': [0.82, ...]}

# NER: named entity recognition
ner = pipeline("token-classification", model="dbmdz/bert-large-cased-finetuned-conll03-english",
               aggregation_strategy="simple")
print(ner("Anthropic, based in San Francisco, was founded by Dario Amodei."))

# Now reproduce the same WITHOUT pipeline() — understand the abstraction:
from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch
tokenizer = AutoTokenizer.from_pretrained("dbmdz/bert-large-cased-finetuned-conll03-english")
model     = AutoModelForTokenClassification.from_pretrained("dbmdz/bert-large-cased-finetuned-conll03-english")
# ... tokenize, forward, decode — understand what pipeline() hides
```

- **Outcomes:**
  - _First Pass:_ All HF pipelines: classification, NER, QA, summarization, translation. Push your fine-tuned model to Hub.
  - _Second Pass:_ Implement training loop using HF `Trainer` and `TrainingArguments`. Understand all arguments.
  - _Third Pass:_ Use `accelerate` for distributed training (simulate with gradient accumulation on single GPU). Push model to Hub with model card.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "HuggingFace API: From pipeline() to AutoModel — What Gets Abstracted"
  - GitHub: Model card template for every HF model you push — builds your public presence on the Hub

---

## PHASE 4: Applied LLM Engineering

### Weeks 41–48 · Production-grade RAG, Agents, MLOps

---

### RAG: Retrieval-Augmented Generation Systems

_Phase 4 · Weeks 41–43_

- **What:** RAG (Lewis et al. 2020) augments LLMs with external knowledge retrieval at inference time. Pipeline: (1) **Ingestion:** chunk documents → embed (e.g., `text-embedding-3-small`) → store in vector DB (Chroma, FAISS, Pinecone). (2) **Retrieval:** embed query → ANN search → retrieve top-k chunks (cosine/dot-product similarity). (3) **Generation:** inject retrieved context into LLM prompt → generate answer grounded in retrieved documents. Prevents hallucination by keeping LLM grounded in actual documents. Advanced: HyDE (hypothetical document embedding), MMR (Maximum Marginal Relevance), re-ranking with cross-encoders.

- **Why:** RAG is the #1 applied LLM engineering pattern in industry. Every enterprise LLM application (customer support, internal Q&A, document analysis) uses RAG. It's the first project a junior LLM engineer builds. Knowing RAG end-to-end — from chunking strategy to retrieval evaluation (RAGAS) — makes you immediately hireable.

- **How to Start:** Build a RAG system over a PDF document (e.g., a research paper) using LangChain or LlamaIndex. Then rebuild it from scratch without those frameworks to understand every component.

- **What Questions to Ask:**
  - What chunking strategy should you use? Fixed-size, sentence-aware, recursive character, semantic? Trade-offs?
  - Why is cosine similarity used for retrieval? What is the relationship to dot-product similarity for unit-normalized vectors?
  - What is Approximate Nearest Neighbor (ANN) search? How do FAISS's IVF and HNSW indices work?
  - What is HyDE (Hypothetical Document Embeddings) and when does it improve retrieval?
  - What is RAGAS? How do faithfulness and answer relevance metrics work?
  - **[Interview]** "Design a RAG system for a 10,000-page legal document corpus. Walk through every component decision."
  - **[Interview]** "Your RAG system retrieves correct documents but the LLM still hallucinates. Diagnose and fix."
  - What is a re-ranker (cross-encoder) and how does it improve over bi-encoder retrieval?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "RAG from scratch Python FAISS LangChain" · [LangChain RAG docs](https://python.langchain.com/docs/use_cases/question_answering/) · Search: "RAGAS evaluation RAG systems"
  - **Papers:** Lewis et al. (2020) "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" · Gao et al. (2023) "Retrieval-Augmented Generation for Large Language Models: A Survey"
  - **Books:** N/A (too new — rely on official docs and papers)
  - **YouTube:** Search: "RAG from scratch LangChain tutorial 2024" · Search: "advanced RAG techniques HyDE MMR reranking"
  - **Problem Sets:** Build RAG over: (1) a research paper PDF, (2) a GitHub repo README, (3) a Wikipedia article. Evaluate with RAGAS.

- **How to Get Started Immediately:**

```python
# pip install chromadb sentence-transformers anthropic pypdf langchain

import chromadb
from sentence_transformers import SentenceTransformer
import anthropic

# Step 1: Embed and store documents
embedder = SentenceTransformer("all-MiniLM-L6-v2")
client   = chromadb.Client()
coll     = client.create_collection("docs")

# Chunk and embed your documents
documents = ["Chunk 1 text...", "Chunk 2 text...", "Chunk 3 text..."]
embeddings = embedder.encode(documents).tolist()
coll.add(documents=documents, embeddings=embeddings,
         ids=[f"doc_{i}" for i in range(len(documents))])

def rag_query(question: str, k: int = 3) -> str:
    # Step 2: Retrieve top-k relevant chunks
    q_embed = embedder.encode([question]).tolist()
    results = coll.query(query_embeddings=q_embed, n_results=k)
    context = "\n\n".join(results["documents"][0])

    # Step 3: Generate grounded answer
    llm    = anthropic.Anthropic()
    prompt = f"""Answer the question based ONLY on the provided context.
If the context doesn't contain enough information, say so.

Context:
{context}

Question: {question}
Answer:"""
    msg = llm.messages.create(model="claude-sonnet-4-6",
                               max_tokens=512,
                               messages=[{"role":"user","content":prompt}])
    return msg.content[0].text

print(rag_query("What is the main contribution of this paper?"))
```

- **Outcomes:**
  - _First Pass:_ Basic RAG pipeline over a PDF with Chroma + SentenceTransformers + any LLM API. Streamlit Q&A interface.
  - _Second Pass:_ Add HyDE for better retrieval. Add cross-encoder re-ranking. Evaluate with RAGAS (faithfulness, relevance).
  - _Third Pass:_ Build production RAG: document ingestion pipeline, persistent vector store, FastAPI backend, Streamlit frontend. Full deployment.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Building RAG from Scratch: Vector DB, Embeddings, and LLM Integration Explained"
  - GitHub: "production-rag-template" — Docker-compose with Chroma + FastAPI + Streamlit
  - Blog: "Evaluating RAG Systems with RAGAS: Faithfulness, Relevance, and Context Recall"

---

### LLM Agents: Tool Use, Planning, ReAct, LangChain/LlamaIndex

_Phase 4 · Weeks 43–45_

- **What:** LLM Agents are LLMs augmented with tools (APIs, code executors, web search, databases) and a reasoning loop. **ReAct framework (Yao et al. 2023):** interleaves Reasoning (chain-of-thought) and Acting (tool calls) in a Thought → Action → Observation loop. **Tool use:** LLM outputs structured JSON tool calls; agent runtime executes them and feeds results back. **Planning:** multi-step task decomposition. **Memory:** short-term (conversation), long-term (vector store), episodic (summarized history). Frameworks: LangChain, LlamaIndex, AutoGen, CrewAI.

- **Why:** Agents are the #1 growth area in applied LLM engineering. Every AI product company is building agent-powered features. An intern who can build a tool-using agent, debug its reasoning failures, and deploy it reliably is immediately productive. Understanding the underlying ReAct/tool-use mechanics (not just framework wrappers) is what separates strong candidates.

- **How to Start:** Build a ReAct agent from scratch using the Anthropic API with tool use. Do not use LangChain for this first exercise.

- **What Questions to Ask:**
  - What is the ReAct framework? How does the Thought-Action-Observation loop work?
  - How does tool use work in the Anthropic/OpenAI API? What is the message format for tool calls?
  - What are the failure modes of LLM agents? (hallucinated tool calls, infinite loops, incorrect reasoning)
  - How do you evaluate an agent's performance? What metrics do you use?
  - **[Interview]** "Design an agent that can answer questions by searching the web and reading relevant pages. How do you handle tool call failures?"
  - **[Interview]** "What is the difference between an agent and a chain in LangChain? When would you use each?"
  - What is human-in-the-loop and when is it necessary in production agents?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "ReAct agents from scratch Anthropic tool use tutorial" · [Anthropic Tool Use docs](https://docs.anthropic.com/en/docs/tool-use) · Search: "LLM agents failure modes evaluation"
  - **Papers:** Yao et al. (2023) "ReAct: Synergizing Reasoning and Acting in Language Models" · Shinn et al. (2023) "Reflexion: Language Agents with Verbal Reinforcement Learning"
  - **Books:** N/A
  - **YouTube:** Search: "LLM agents from scratch tutorial 2024" · Search: "LangChain agents explained"
  - **Problem Sets:** Build agents for: (1) web search + summarization, (2) Python code execution, (3) database query agent

- **How to Get Started Immediately:**

```python
import anthropic, json

client = anthropic.Anthropic()

# Define tools — the LLM decides when and how to call these
tools = [
    {
        "name": "web_search",
        "description": "Search the web for current information.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculator",
        "description": "Evaluate a mathematical expression.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string"}
            },
            "required": ["expression"]
        }
    }
]

def execute_tool(name, inputs):
    if name == "calculator":
        return str(eval(inputs["expression"]))  # careful with eval in prod!
    if name == "web_search":
        return f"[Search results for: {inputs['query']}]"  # stub

def run_agent(user_message: str, max_iterations: int = 10):
    messages = [{"role": "user", "content": user_message}]
    for _ in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-6", max_tokens=4096,
            tools=tools, messages=messages
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Extract final text response
            return next(b.text for b in response.content if hasattr(b, 'text'))

        # Handle tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "user", "content": tool_results})

print(run_agent("What is 1234 * 5678 and explain the calculation?"))
```

- **Outcomes:**
  - _First Pass:_ ReAct agent from scratch with 2–3 tools. No frameworks. Understand every API call.
  - _Second Pass:_ Add memory (conversation history + vector store for long-term). Add error handling for tool failures.
  - _Third Pass:_ Production agent: FastAPI backend + Streamlit chat interface + Docker deployment. Evaluate with task success rate metric.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Building an LLM Agent from Scratch: ReAct Loop, Tool Use, and Failure Modes"
  - GitHub: "production-llm-agent" — FastAPI + Streamlit + Docker, configurable tools
  - Blog: "LLM Agent Failure Modes: 7 Things That Go Wrong and How to Fix Them"

---

### Prompt Engineering & LLM API Integration

_Phase 4 · Weeks 41–42 (parallel to RAG start)_

- **What:** Systematic techniques for eliciting desired LLM behaviors via prompt design: **Zero-shot, Few-shot, Chain-of-Thought (CoT), Tree-of-Thought (ToT), ReAct**. Output formatting: structured JSON via function calling/tool use, regex constraints, grammar-based sampling. **System prompts:** persona, guardrails, format specification. **Prompt templates:** parametric prompts for production pipelines. API integration: streaming, async, retry logic, cost estimation, token counting.

- **Why:** Prompt engineering is immediately applicable in any LLM internship. Even non-research roles require building reliable LLM pipelines with structured outputs. Understanding when CoT helps (complex reasoning), when few-shot helps (consistent formatting), and when they hurt (bias reinforcement) is the engineering judgment that matters.

- **How to Start:** Reproduce 5 prompting techniques from the Anthropic prompt library. Measure output quality with a consistent rubric.

- **What Questions to Ask:**
  - When does Chain-of-Thought reasoning help vs hurt? What is the empirical evidence?
  - What is temperature and how does it affect output diversity? What temperature do you use for structured output extraction vs creative generation?
  - How do you extract structured JSON reliably from an LLM? What are the failure modes?
  - **[Interview]** "You need to extract structured data (name, date, amount) from 10,000 invoices using an LLM API. Design the production pipeline."
  - **[Interview]** "Your LLM pipeline costs $2,000/month. How do you reduce cost by 80% without significant quality loss?"
  - What is constitutional AI and how does RLHF differ from instruction tuning?

- **Standard Resources:**
  - **Blogs/Articles:** [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/prompt-engineering) · Search: "chain-of-thought prompting Wei et al 2022" · [OpenAI Cookbook](https://cookbook.openai.com)
  - **Papers:** Wei et al. (2022) "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" · Yao et al. (2024) "Tree of Thoughts"
  - **Books:** N/A
  - **YouTube:** Search: "prompt engineering techniques production LLM 2024"
  - **Problem Sets:** Build a structured extraction pipeline for 5 different document types. Measure accuracy vs cost.

- **How to Get Started Immediately:**

````python
import anthropic, json
from pydantic import BaseModel

client = anthropic.Anthropic()

class InvoiceData(BaseModel):
    vendor: str
    date: str
    amount: float
    currency: str
    line_items: list[dict]

def extract_invoice(invoice_text: str) -> InvoiceData:
    """Reliable structured extraction with Pydantic validation."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="You are an expert at extracting structured data from invoices. Always respond with valid JSON only.",
        messages=[{
            "role": "user",
            "content": f"""Extract the following fields from this invoice:
vendor, date (YYYY-MM-DD), amount (float), currency (3-letter code), line_items (list of {{description, qty, unit_price}})

Invoice text:
{invoice_text}

Respond with ONLY valid JSON matching the schema exactly."""
        }]
    )
    raw = response.content[0].text.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip("json\n")
    return InvoiceData(**json.loads(raw))
````

- **Outcomes:**
  - _First Pass:_ Implement all prompting techniques (zero-shot, few-shot, CoT, structured extraction). Measure quality.
  - _Second Pass:_ Build async LLM pipeline with retry logic and cost tracking. Implement streaming responses in Streamlit.
  - _Third Pass:_ Production extraction pipeline: batch processing, error handling, Pydantic validation, FastAPI endpoint.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Structured Output Extraction with LLMs: Reliability Patterns for Production"
  - GitHub: "llm-structured-extraction" — template for reliable JSON extraction from any document type

---

### MLOps Foundations: Experiment Tracking, Model Registry, Monitoring

_Phase 4 · Weeks 46–47_

- **What:** **Experiment tracking (MLflow, wandb):** log hyperparameters, metrics, artifacts per run — enables reproducibility and comparison. **Model registry:** version control for model artifacts with staging (development → staging → production) and rollback capability. **Data versioning (DVC):** track dataset versions alongside code. **Model monitoring:** detect data drift (KS test, population stability index), model drift (performance degradation), and data quality issues in production.

- **Why:** Every ML team at companies with >10 engineers uses experiment tracking and model registries. An intern who sets up MLflow or wandb on day one and structures experiments correctly demonstrates senior-level professional habits. Model monitoring is the #1 gap between ML research and production — 90% of models fail silently in production.

- **How to Start:** Integrate wandb into your most recent PyTorch training loop. Log all hyperparameters, loss curves, and model artifacts.

- **What Questions to Ask:**
  - What is the difference between experiment tracking and model versioning?
  - How do you detect data drift in production? What statistical tests do you use?
  - What is the difference between concept drift and covariate shift?
  - **[Interview]** "Your production model's AUC dropped from 0.91 to 0.73 over 2 months. Walk through your investigation."
  - **[Interview]** "Design a system to monitor a fraud detection model in production. What metrics do you track and at what frequency?"

- **Standard Resources:**
  - **Blogs/Articles:** [wandb docs](https://docs.wandb.ai) · [MLflow docs](https://mlflow.org/docs/latest/index.html) · Search: "model monitoring data drift detection production ML"
  - **Papers:** Sculley et al. (2015) "Hidden Technical Debt in Machine Learning Systems" — essential reading
  - **Books:** Kleppmann "Designing Data-Intensive Applications" — background for data pipelines
  - **YouTube:** Search: "MLflow experiment tracking tutorial 2024" · Search: "wandb tutorial PyTorch"
  - **Problem Sets:** Set up wandb on your transformer training. Implement a drift detection script using KS test.

- **How to Get Started Immediately:**

```python
import wandb, torch

# Initialize wandb project — always do this before training
wandb.init(
    project="ml-roadmap",
    config={
        "model": "transformer",
        "d_model": 512,
        "n_heads": 8,
        "learning_rate": 1e-3,
        "batch_size": 64,
        "epochs": 50,
        "optimizer": "AdamW"
    }
)

# In your training loop — add 3 lines to any existing loop
for epoch in range(num_epochs):
    train_loss = train_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader)

    # Log to wandb — automatically creates charts, comparisons
    wandb.log({
        "epoch": epoch,
        "train_loss": train_loss,
        "val_loss": val_loss,
        "val_accuracy": val_acc,
        "lr": optimizer.param_groups[0]["lr"]
    })

    # Save model checkpoint as wandb artifact
    if val_loss < best_val_loss:
        torch.save(model.state_dict(), "best_model.pt")
        wandb.save("best_model.pt")

wandb.finish()
```

- **Outcomes:**
  - _First Pass:_ wandb integrated into all training loops. All experiments logged. Compare runs via wandb dashboard.
  - _Second Pass:_ MLflow model registry: log model, register version, transition to production. DVC for dataset versioning.
  - _Third Pass:_ Production monitoring: implement drift detection script that runs daily, sends alert if PSI > 0.2.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "MLOps from Zero: Setting Up Experiment Tracking, Model Registry, and Drift Monitoring"
  - GitHub: "mlops-template" — wandb + MLflow + DVC + drift detection in one repository

---

### Docker & Production Deployment

_Phase 4 · Week 48_

- **What:** Docker packages applications and their dependencies into portable container images. For ML: Dockerfile specifies base image (CUDA-enabled), Python version, library installation, model weight copying, and entrypoint (uvicorn for FastAPI). `docker-compose.yml` orchestrates multi-container apps (FastAPI + Streamlit + vector DB). Key concepts: image vs container, layer caching, multi-stage builds (smaller production images), volume mounts (for model weights), environment variables for secrets.

- **Why:** Docker is the deployment standard for ML APIs in industry. Every production ML system runs in containers. An intern who can write a Dockerfile, build an image, and deploy it to a cloud provider (Render, Railway, EC2) demonstrates engineering maturity that most ML students lack. This is the last mile separating "I trained a model" from "I deployed a model."

- **How to Start:** Containerize your FastAPI LightGBM service from Phase 1.5. Build, run locally, push to Docker Hub.

- **What Questions to Ask:**
  - What is the difference between a Docker image and a Docker container?
  - How does Docker layer caching work? How do you structure a Dockerfile to maximize cache hits?
  - What is a multi-stage Docker build and why is it important for ML (large base images)?
  - **[Interview]** "Walk me through containerizing a FastAPI ML service. What base image do you choose and why?"
  - **[Interview]** "How do you handle large model weights in a Docker container? (Do not `COPY` 10GB into the image.)"

- **Standard Resources:**
  - **Blogs/Articles:** [Docker official docs](https://docs.docker.com) · Search: "Docker FastAPI ML deployment tutorial" · Search: "Docker multi-stage build Python ML"
  - **YouTube:** TechWorld with Nana: "Docker Tutorial for Beginners" · Search: "Docker FastAPI deployment production 2024"
  - **Problem Sets:** Containerize every FastAPI service you built. Deploy one to a free cloud provider.

- **How to Get Started Immediately:**

```dockerfile
# Dockerfile for FastAPI ML service
# Multi-stage: build stage (with dev deps) → production stage (minimal)

FROM python:3.11-slim AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (cached layer if requirements unchanged)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY models/ ./models/   # Small models only — large ones: load from S3/Hub

# Production entrypoint
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000",
     "--workers", "1"]  # Single worker for GPU models
```

```yaml
# docker-compose.yml — full stack deployment
version: "3.9"
services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      - MODEL_PATH=/models/lgbm_model.pkl
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./models:/models # mount model weights separately

  frontend:
    image: streamlit-app:latest
    ports: ["8501:8501"]
    depends_on: [api]
    environment:
      - API_URL=http://api:8000

  chromadb:
    image: chromadb/chroma:latest
    ports: ["8002:8000"]
    volumes:
      - chroma_data:/chroma/chroma

volumes:
  chroma_data:
```

- **Outcomes:**
  - _First Pass:_ Containerize FastAPI service. Run locally. Push to Docker Hub.
  - _Second Pass:_ docker-compose with FastAPI + Streamlit + ChromaDB. One command to start the full stack.
  - _Third Pass:_ GitHub Actions: on push to main, build → test → push image → deploy to Render. Full CI/CD.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "Dockerizing an ML API: From Jupyter Notebook to Production Container in 1 Hour"
  - GitHub: "ml-docker-template" — production-ready Dockerfile + docker-compose for FastAPI + Streamlit

---

## PHASE 5: Interview Prep & Portfolio Finalization

### Weeks 49–52 · Convert knowledge to offers

---

### ML Technical Interview Preparation

_Phase 5 · Weeks 49–52_

- **What:** ML interviews assess: (1) **ML theory** — derivations, algorithm trade-offs, when to use what, (2) **ML coding** — implement algorithms from scratch in Python/NumPy, (3) **ML system design** — design a complete ML system end-to-end, (4) **Case studies** — diagnose a failing model, (5) **Coding (DSA)** — LeetCode medium, focus on arrays, hashmaps, graphs, dynamic programming.

- **Why:** Internship interviews at ML-focused companies (research labs, AI startups, ML platform teams) are uniquely demanding. A candidate who can derive backpropagation AND implement a production RAG system is in the top 5% of applicants. The portfolio + interview preparation combination is the fastest path to offers.

- **How to Start:** Begin mock interviews at Week 20 (after Phase 2 starts). One mock interview per week from Week 40 onwards.

- **What Questions to Ask (These ARE the interview questions — prepare them):**
  - Derive the softmax + cross-entropy backward pass.
  - Implement K-Means from scratch in Python. Handle edge cases.
  - Implement backpropagation for a 2-layer MLP in NumPy.
  - Design a fraud detection ML system from scratch. What are your features, model choice, evaluation, deployment?
  - Why is your gradient vanishing? How do you diagnose and fix it?
  - You have 1M users, 100K items, 10M interactions. Design a recommendation system.
  - Your BERT model has 95% accuracy but customers complain it's wrong. What's going on?
  - Derive XGBoost's optimal leaf weight.
  - What is the difference between L1 and L2 regularization? Geometric + Bayesian views.
  - How would you fine-tune a 7B LLM on 8GB VRAM?

- **Standard Resources:**
  - **Blogs/Articles:** [deep-ml.com/problems](https://www.deep-ml.com/problems) — do EVERY problem in the list · Search: "ML system design interview primer" · [Chip Huyen's ML Interviews Book](https://huyenchip.com/ml-interviews-book/) — free online
  - **Papers:** Review all seminal papers covered in the roadmap
  - **Books:** Chip Huyen "Designing Machine Learning Systems" — Ch. 1–5 for system design
  - **YouTube:** Search: "ML system design interview" · Search: "ML coding interview NumPy backpropagation"
  - **Problem Sets:** deep-ml.com — complete ALL problems · LeetCode: top 50 problems from arrays, strings, hashmaps · Kaggle: achieve a medal on at least one competition

- **How to Get Started Immediately:**

```python
# Run this mock interview question right now:
# "Implement K-Means from scratch in NumPy with K-Means++ init"
# Time yourself. Target: 20 minutes from blank page to correct output.

# Then implement Logistic Regression from scratch.
# Then implement backprop for a 2-layer MLP.
# One from-scratch implementation per day starting Week 40.
```

- **Outcomes:**
  - _First Pass:_ Complete all deep-ml.com problems. 50 LeetCode medium. One mock interview/week.
  - _Second Pass:_ 3 ML system design mockups (written). One full technical blog explaining your approach to each.
  - _Third Pass:_ Final portfolio review: 3 deployed projects with public URLs, 5 blog posts, GitHub with 100+ commits, HuggingFace Hub with 2+ models.

- **What I Can Learn From It & Resources to Generate:**
  - Blog Series: "ML Interview Prep: Deriving Backprop in 15 Minutes Flat"
  - GitHub: Interview preparation repository — your from-scratch implementations for every algorithm in the roadmap

---

### Portfolio Strategy & GitHub Profile Optimization

_Phase 5 · Weeks 49–52_

- **What:** Your portfolio is: (1) **GitHub profile** — pinned repos, contribution graph, quality of READMEs, CI badges, (2) **Deployed projects** — public URLs showing live demos, (3) **Technical writing** — blog posts demonstrating depth of understanding, (4) **HuggingFace Hub** — public models and Spaces, (5) **Kaggle** — competition medals and public notebooks.

- **Why:** For ML internship applications, a strong portfolio eliminates the need for a perfect GPA or prestigious university. Recruiters at ML companies are technical — they will clone your repos, read your code, and follow your blog. A deployed RAG system with a detailed README and a 1000-word technical blog post about how you built it is worth more than 10 Coursera certificates.

- **How to Start:** Identify your 3 strongest projects. Write detailed README + a companion blog post for each. Deploy all three.

- **What Questions to Ask:**
  - Which 3 projects best demonstrate the full stack from math to deployment?
  - Is every project deployable with one command (`docker-compose up`)?
  - Does each README have: problem statement, approach, results table, installation, and a demo GIF?
  - Are all your blog posts technically deep enough to demonstrate expertise to a senior engineer?
  - Are your HuggingFace models public with model cards?

- **Standard Resources:**
  - **Blogs/Articles:** Search: "ML portfolio GitHub profile tips 2024" · Search: "technical blog writing for ML engineers"
  - **YouTube:** Search: "GitHub profile README portfolio tips for ML engineers"

- **How to Get Started Immediately (Portfolio Checklist):**

```markdown
## Portfolio Checklist for ML Internship

### GitHub (minimum standard)

- [ ] Profile README with bio, skills, project links
- [ ] 3+ pinned repos with clear descriptions
- [ ] Each repo has: README, requirements.txt, CI badge, demo GIF/screenshot
- [ ] Contribution graph shows consistent daily activity
- [ ] All repos use Conventional Commits

### Projects (minimum 3 deployed)

- [ ] P1: Classical ML — LightGBM + SHAP + Streamlit (HuggingFace Spaces URL)
- [ ] P2: TinyTorch — Autograd engine with training demo
- [ ] P3: RAG System — FastAPI + ChromaDB + Streamlit (Render/Railway URL)

### Writing (minimum 5 posts)

- [ ] 1 derivation post (backprop, XGBoost objective, etc.)
- [ ] 1 project deep-dive (how you built your RAG system)
- [ ] 1 benchmark/comparison post (LoRA vs full fine-tune)
- [ ] 1 tutorial post (CUDA setup, FastAPI serving)
- [ ] 1 system design post (design a recommendation system)

### HuggingFace

- [ ] At least 1 fine-tuned model with model card
- [ ] At least 1 Space (Streamlit demo)
- [ ] All models have proper model cards

### Kaggle

- [ ] At least 1 competition with public notebook
- [ ] Top 20% placement on at least one structured data competition
```

- **Outcomes:**
  - _First Pass:_ Audit all existing projects. Fix READMEs. Add demo GIFs. Ensure all are deployable.
  - _Second Pass:_ Write 5 technical blog posts. Submit to Towards Data Science or personal blog.
  - _Third Pass:_ Apply to 20 internships. Tailor cover letter to each. Reference specific projects and blog posts.

- **What I Can Learn From It & Resources to Generate:**
  - Blog: "My ML Internship Portfolio — What Worked and What Didn't"
  - Everything in this roadmap IS the portfolio content

---

## PROJECT PROGRESSION

### 8 Projects: Beginner Tabular → Production LLM System

---

### Project 1: Tabular ML Baseline Pipeline

**Tier:** Beginner · **When:** Week 4 (after Linear + Logistic Regression)

**Description:** End-to-end tabular ML pipeline on a real-world dataset. Feature engineering, missing value imputation, categorical encoding, Linear/Logistic Regression baselines, model evaluation with full metrics suite.

**Dataset:** Titanic (Kaggle) or any UCI ML repository dataset

**Tech Stack:** `pandas`, `numpy`, `scikit-learn`, `matplotlib`, `streamlit`

**Deliverables:**

- EDA notebook with profiling report
- Feature engineering pipeline (sklearn Pipeline)
- Model comparison: Logistic Regression vs Decision Tree vs baseline
- Streamlit dashboard showing: EDA plots, model predictions, confusion matrix, ROC curve
- Deployed on Hugging Face Spaces

**What It Proves:** Data cleaning, sklearn API, model evaluation, basic deployment

---

### Project 2: LightGBM + SHAP ML Explainability Dashboard

**Tier:** Intermediate · **When:** Week 12 (after XGBoost/LightGBM)

**Description:** Full ML pipeline on a structured Kaggle competition dataset. Feature engineering, LightGBM training with Optuna hyperparameter optimization, SHAP global and local explanations, deployed as an interactive Streamlit dashboard.

**Dataset:** Porto Seguro Safe Driver Prediction OR House Prices Advanced

**Tech Stack:** `lightgbm`, `xgboost`, `optuna`, `shap`, `streamlit`, `fastapi`, `pydantic`

**Deliverables:**

- Optuna hyperparameter search with wandb logging
- SHAP: summary plots, force plots, dependence plots
- FastAPI `/predict` endpoint with SHAP explanation in response JSON
- Streamlit dashboard: upload a data row → get prediction + SHAP explanation
- Docker container for the full stack

**What It Proves:** Production ML, explainability, API design, containerization

---

### Project 3: TinyTorch — From-Scratch Deep Learning Framework

**Tier:** Intermediate-Advanced · **When:** Week 22 (after Phase 2 autograd section)

**Description:** Your own deep learning framework built from scratch in Python. Autograd engine, Module system, optimizers (SGD, AdamW), DataLoader, training loop. Train an MLP on MNIST and compare accuracy/speed with equivalent PyTorch model.

**Tech Stack:** `numpy`, `cupy` (optional CUDA backend), no ML frameworks

**Deliverables:**

- `tinytorch/` Python package: Tensor, autograd engine, Module, Linear, ReLU, LayerNorm, SGD, AdamW, DataLoader
- Unit tests with numerical gradient verification for every operation
- Benchmark notebook: TinyTorch vs PyTorch on MNIST (accuracy should match, speed ≈ 50x slower — that's expected)
- Architecture diagram showing the computation graph and backward pass
- Detailed README explaining every design decision

**What It Proves:** Deep understanding of PyTorch internals, gradient computation, software engineering

---

### Project 4: Character-Level Language Model from Scratch

**Tier:** Intermediate · **When:** Week 30 (after RNNs + PyTorch)

**Description:** Implement a character-level language model (first LSTM, then Transformer) trained on Shakespeare or a Python code corpus. Generate coherent text. Deploy as a text generation web app.

**Dataset:** Shakespeare (~1MB) or Python code corpus

**Tech Stack:** `pytorch`, `streamlit`, `fastapi`

**Deliverables:**

- LSTM character LM: train to <1.5 bits/char on Shakespeare
- Mini-GPT (decoder-only transformer, 6 layers, 6 heads, d_model=384): train to <1.3 bits/char
- Text generation Streamlit app: input prompt → generate N characters with temperature control
- Training curves in wandb showing LSTM vs Transformer convergence

**What It Proves:** PyTorch proficiency, RNN + Transformer implementation, NLP basics

---

### Project 5: BERT Fine-tuned NLP API

**Tier:** Advanced · **When:** Week 38 (after BERT + HuggingFace)

**Description:** Fine-tune BERT (with LoRA for efficiency) on a custom NLP task (sentiment, NER, or a domain-specific classification task). Expose via FastAPI. Evaluate with proper NLP metrics (F1, ROUGE, BERTScore).

**Dataset:** Custom scrape OR Kaggle NLP competition OR HuggingFace dataset hub

**Tech Stack:** `transformers`, `peft`, `datasets`, `fastapi`, `docker`, `huggingface_hub`

**Deliverables:**

- LoRA fine-tuned BERT/RoBERTa on custom task (>90% accuracy)
- Proper train/val/test evaluation with sklearn + HuggingFace `evaluate`
- FastAPI `/classify` endpoint with batch inference support
- Model pushed to HuggingFace Hub with model card
- Streamlit demo deployed as HuggingFace Space
- Docker image pushed to Docker Hub

**What It Proves:** HuggingFace ecosystem, fine-tuning, API design, model deployment, HF Hub

---

### Project 6: Production RAG System

**Tier:** Advanced · **When:** Week 43 (after RAG topic)

**Description:** Full production-grade RAG system. Multi-document ingestion, semantic chunking, embedding, vector storage, retrieval with re-ranking, LLM generation, RAGAS evaluation. FastAPI backend + Streamlit frontend + Docker deployment.

**Dataset:** Your choice: research papers, company documentation, Wikipedia dumps, GitHub repos

**Tech Stack:** `anthropic` or `openai`, `chromadb` or `faiss`, `sentence-transformers`, `fastapi`, `streamlit`, `docker`, `pydantic`

**Deliverables:**

- Document ingestion pipeline: PDF + web scraping → chunking → embedding → storage
- Retrieval: bi-encoder retrieval + cross-encoder re-ranking
- Generation: grounded LLM responses with citations
- RAGAS evaluation: faithfulness >0.8, answer relevancy >0.75
- Full Streamlit chat interface with source citations
- Docker-compose deployment (1-command startup)
- GitHub Actions: lint + test + build pipeline

**What It Proves:** LLM engineering, vector databases, production system design, evaluation

---

### Project 7: LLM Agent with Tool Use

**Tier:** Advanced · **When:** Week 45 (after Agents topic)

**Description:** Production-grade LLM agent that uses tools (web search, code execution, database queries, file I/O) to accomplish multi-step tasks. Built from scratch using the Anthropic API — no LangChain wrapper. FastAPI backend with configurable tool registry.

**Tech Stack:** `anthropic`, `fastapi`, `streamlit`, `docker`, `pydantic`

**Deliverables:**

- ReAct agent with at minimum: web_search, python_repl, read_file, write_file tools
- Configurable system prompt and tool registry
- Conversation memory (short-term) + vector store summarization (long-term)
- Error handling: tool call failures, infinite loop detection, token limit management
- Streamlit chat interface showing Thought-Action-Observation trace
- Evaluation: task success rate on 20 predefined multi-step tasks
- Docker-compose deployment

**What It Proves:** LLM agent engineering, tool use, production system design, error handling

---

### Project 8: End-to-End LLM Application — Deployed, Monitored, Evaluated

**Tier:** Production · **When:** Week 48 (end of Phase 4)

**Description:** Your capstone. A complete, domain-specific LLM application combining RAG + Agents + fine-tuning + monitoring. Choose a domain you care about (e.g., "ML Paper Summarizer & Q&A Agent", "Code Review Assistant", "Technical Interview Practice System"). This is your flagship portfolio project.

**Example: "ML Paper Assistant"**

- Ingests arXiv ML papers (RAG pipeline)
- Fine-tuned embedding model for ML-specific retrieval
- Agent that can: search papers, compare methods, explain concepts, generate code examples
- Monitoring: user feedback loop, response quality tracking, drift detection
- Full production deployment: Docker + cloud (Render/Railway) + custom domain

**Tech Stack:** `anthropic`, `transformers`, `peft`, `chromadb`, `fastapi`, `streamlit`, `docker`, `wandb`, `github-actions`

**Deliverables:**

- Full application with distinct frontend (Streamlit) and backend (FastAPI)
- wandb tracking for LLM call costs, latency, user satisfaction
- Automated evaluation suite running weekly
- Model card and system documentation
- 3,000-word technical blog post about the system design
- GitHub Actions: full CI/CD pipeline → automated deployment
- Public URL on your resume

**What It Proves:** Everything in this roadmap. This is the project you demo in every interview.

---

## Master Resource Reference

### Essential Papers (Read in Order)

1. Rumelhart et al. (1986) — Backpropagation
2. Breiman (2001) — Random Forests
3. Friedman (2001) — Gradient Boosting Machines
4. Chen & Guestrin (2016) — XGBoost
5. Ke et al. (2017) — LightGBM
6. Mikolov et al. (2013) — Word2Vec
7. Bahdanau et al. (2015) — Attention Mechanism
8. Vaswani et al. (2017) — Attention Is All You Need
9. Devlin et al. (2019) — BERT
10. Radford et al. (2019) — GPT-2
11. Brown et al. (2020) — GPT-3 (Few-Shot Learning)
12. Hu et al. (2022) — LoRA
13. Dettmers et al. (2023) — QLoRA
14. Lewis et al. (2020) — RAG
15. Yao et al. (2023) — ReAct Agents
16. Lundberg (2017) — SHAP

### Weekly Problem Set Targets

| Phase | Platform                        | Daily Target               |
| ----- | ------------------------------- | -------------------------- |
| 0–1   | deep-ml.com                     | 2 problems/day             |
| 2     | deep-ml.com                     | 1 problem/day + 1 LeetCode |
| 3     | deep-ml.com + HF courses        | 1 problem/day              |
| 4–5   | Mock interviews + system design | 1 mock/week                |

### Interview Preparation Timeline

| Week | Activity                                            |
| ---- | --------------------------------------------------- |
| 20   | First mock interview (linear regression + backprop) |
| 25   | deep-ml.com: complete 50 problems                   |
| 30   | First ML system design mock (recommend a movie)     |
| 35   | LeetCode: complete 50 medium problems               |
| 40   | 2 mock interviews/week from this point              |
| 45   | Start applying to internships                       |
| 48   | Complete all deep-ml.com problems                   |
| 49   | 5 mock interviews/week until offer                  |

---

_Generated by: Senior ML Engineer + Applied AI Tech Lead_  
_Revision: 2024-2025 | RTX 4060 + WSL2 Ubuntu 24.04 Optimized_  
_Total scope: 52 weeks · 30+ topics · 8 projects · 16 seminal papers_
