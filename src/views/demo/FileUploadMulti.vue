<template>

<!--    <form method="POST" enctype="multipart/form-data" action="http://127.0.0.1:6009/scloud-storage/api/v1/file/uploadMulti?verifyCode=536c8c53-1388-44eb-a6e3-61548d88ac62&token=&uploadTypeName=IMG_AVATAR">
        <p>文件1：<input type="file" name="file" /></p>
        <p>文件2：<input type="file" name="file" /></p>
        <p>文件3：<input type="file" name="file" /></p>
        <p><input type="submit" value="上传" /></p>
    </form>-->

    <form method="POST" enctype="multipart/form-data" action="http://127.0.0.1:6001/scm/api/v1/file/uploadMulti?token=&uploadTypeName=IMG_AVATAR">
        <p>文件1：<input type="file" name="file" /></p>
        <p>文件2：<input type="file" name="file" /></p>
        <p>文件3：<input type="file" name="file" /></p>
        <p><input type="submit" value="上传" /></p>
    </form>

</template>
<script>

</script>

<style>

</style>
