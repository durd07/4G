
./scripts/osa_kermod_unload.sh 2>/dev/null

insmod ./kermod/osa_kermod.ko

if [ ! -f /dev/dev_dma ]
then
    major=$(awk '$2=="dev_dma" {print $1}' /proc/devices)
    mknod /dev/dev_dma c ${major} 0
fi

