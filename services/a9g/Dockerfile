FROM ubuntu:20.04

ARG UID
ARG GID
ARG USER=a9g

# Instalação de dependências
RUN DEBIAN_FRONTEND=noninteractive apt-get update -qq 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    build-essential \
    git \
    gcc-multilib \
    g++-multilib \
    lib32z1 \
    python \
    unzip \
    sudo

# Adiciona o grupo a9g
RUN addgroup --gid $GID $USER
# Adiciona o usuário a9g e o coloca no grupo a9g com UID e GID definidos
RUN adduser --uid $UID --gid $GID --disabled-password --gecos "" $USER
# Adiciona o usuário a9g ao grupo sudo sem solicitar senha
RUN echo "$USER ALL=(ALL) NOPASSWD:ALL" | tee -a /etc/sudoers > /dev/null

# Define o usuário a9g como usuário padrão
USER $UID:$GID

# Define o diretório de trabalho
WORKDIR /home/$USER
# Define o shell padrão
RUN touch ~/.profile

RUN git clone https://github.com/mateusjrcavalcanti/GPRS_CSDTK ~/GPRS_CSDTK
RUN mkdir ~/projects

RUN git clone https://github.com/mateusjrcavalcanti/GPRS_C_SDK.git ~/projects/GPRS_C_SDK --recursive
RUN chmod +x ~/projects/GPRS_C_SDK/build.sh 
RUN chmod +x ~/projects/GPRS_C_SDK/platform/compilation/elfCombine.pl

# Executa script de setup
RUN cd ~/GPRS_CSDTK/CSDTK \
    && ./setup.sh ./ ~/projects \
    && echo "setup complete, now clean"

# Limpeza do sistema
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get autoremove -y --purge
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get clean -y
RUN sudo rm -rf /var/lib/apt/lists/* 
RUN sudo rm -rf /tmp 
RUN echo "build complete"

WORKDIR /home/$USER/projects/GPRS_C_SDK

