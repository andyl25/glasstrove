from django.conf import settings
from django.db import models

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300, default="no title")
    img = models.FileField(upload_to="glasstrove/", default="error")
    image_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_vid')
    posted_date = models.DateTimeField(blank=True, null=True)

    def get_image_from_url(self, url):
       img_tmp = NamedTemporaryFile(delete=True)
       with urlopen(url) as uo:
           assert uo.status == 200
           img_tmp.write(uo.read())
           img_tmp.flush()
       img = File(img_tmp)
       self.image.save(img_tmp.name, img)
       self.image_url = url

