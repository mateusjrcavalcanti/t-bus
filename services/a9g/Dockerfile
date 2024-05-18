FROM ubuntu:20.04 as CSDTK
# Instalação de dependências
RUN DEBIAN_FRONTEND=noninteractive apt-get update -qq 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    unzip \
    wget 
# DIRETÓRIO TEMPORÁRIO
RUN mkdir /home/root -p
WORKDIR /home/root
# DOWNLOAD DO CSDTK
RUN wget https://github.com/mateusjrcavalcanti/GPRS_C_SDK/releases/download/v2.129/CSDTK42_Linux.tar.gz
RUN tar -xzf CSDTK42_Linux.tar.gz
RUN rm CSDTK42_Linux.tar.gz
# LIMPEZA DO SISTEMA
RUN DEBIAN_FRONTEND=noninteractive apt-get autoremove -y --purge
RUN DEBIAN_FRONTEND=noninteractive apt-get clean -y
RUN rm -rf /var/lib/apt/lists/* 
RUN rm -rf /tmp 

FROM ubuntu:20.04 as GPRS_C_SDK
# Instalação de dependências
RUN DEBIAN_FRONTEND=noninteractive apt-get update -qq 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    git
# DIRETÓRIO TEMPORÁRIO
RUN mkdir /home/root
WORKDIR /home/root
# DOWNLOAD DO GPRS_C_SDK
RUN git clone https://github.com/mateusjrcavalcanti/GPRS_C_SDK.git /home/root/GPRS_C_SDK --recursive
RUN chmod +x /home/root/GPRS_C_SDK/build.sh 
RUN chmod +x /home/root/GPRS_C_SDK/platform/compilation/elfCombine.pl
# LIMPEZA DO SISTEMA
RUN DEBIAN_FRONTEND=noninteractive apt-get autoremove -y --purge
RUN DEBIAN_FRONTEND=noninteractive apt-get clean -y
RUN rm -rf /var/lib/apt/lists/* 
RUN rm -rf /tmp 

FROM ubuntu:20.04 as BUILD

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
    python
RUN apt-get update

# coolwatcher dependences
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq software-properties-common
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:rock-core/qt4 -y
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:linuxuprising/libpng12 -y
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    libqt4-qt3support \
    itcl3 \
    itk3 \ 
    iwidgets4 \
    libpng12-0 \
    libusb-0.1-4 \
    libqt4-dev

# Adiciona o grupo a9g
RUN addgroup --gid $GID $USER
# Adiciona o usuário a9g e o coloca no grupo a9g com UID e GID definidos
RUN adduser --uid $UID --gid $GID --disabled-password --gecos "" $USER
# Adiciona o usuário a9g ao grupo sem solicitar senha
RUN echo "$USER ALL=(ALL) NOPASSWD:ALL" | tee -a /etc/sudoers > /dev/null

# Define o usuário a9g como usuário padrão
USER $UID:$GID

# Define o diretório de trabalho
WORKDIR /home/$USER
# Define o shell padrão
RUN touch ~/.profile

# Download do CSDTK42
COPY --from=CSDTK --chown=$UID:$GID /home/root/CSDTK /home/$USER/CSDTK

# Download do GPRS_C_SDK
COPY --from=GPRS_C_SDK --chown=$UID:$GID /home/root/GPRS_C_SDK /home/$USER/GPRS_C_SDK

# fix CSDTK https://github.com/Ai-Thinker-Open/GPRS_C_SDK/issues/442
RUN cd /home/$USER/CSDTK/lib
RUN bash -c ' \
    for file in $(find . -maxdepth 1 -name "libQt*.so.4"); do \
    basefile=$(basename "$file"); \
    mv "$file" "_$basefile"; \
    target="/usr/lib/x86_64-linux-gnu/${basefile}.8.7"; \
    echo "TARGET=${target}"; \
    if [ -e "$target" ]; then \
    ln -sf "$target" "$basefile"; \
    else \
    echo "Warning: Target $target does not exist."; \
    fi \
    done \
    '


# Executa script de setup
RUN cd ~/CSDTK \
    && ./setup.sh ./ ~/

# Limpeza do sistema
USER root
RUN DEBIAN_FRONTEND=noninteractive apt-get autoremove -y --purge
RUN DEBIAN_FRONTEND=noninteractive apt-get clean -y
RUN rm -rf /var/lib/apt/lists/* 
RUN rm -rf /tmp 
RUN echo "build complete"

USER $UID:$GID
WORKDIR /home/$USER/GPRS_C_SDK

